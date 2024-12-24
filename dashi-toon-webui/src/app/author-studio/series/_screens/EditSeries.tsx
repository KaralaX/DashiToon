"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { FancyMultiSelect } from "@/components/FancyMultiSelect";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import * as env from "@/utils/env";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { contentCategories, RATING_CONFIG_2, STATUS_CONFIG } from "@/utils/consts";
import { Checkbox } from "@/components/ui/checkbox";
import SiteLayout from "@/components/SiteLayout";
import { Home } from "lucide-react";
import TagsInput from "@/components/TagsInput";
import Cropper from "react-easy-crop";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";

type Genre = {
    id: number;
    name: string;
};

type SelectableItem = {
    value: number;
    label: string;
};

type CropArea = {
    x: number;
    y: number;
    width: number;
    height: number;
};

function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new window.Image();
        img.addEventListener("load", () => resolve(img));
        img.addEventListener("error", reject);
        img.src = url;
    });
}

async function getCroppedImg(imageSrc: string, pixelCrop: CropArea): Promise<Blob> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        throw new Error("No 2d context");
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height,
    );

    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            if (blob) resolve(blob);
        }, "image/jpeg");
    });
}

const editSeriesSchema = z.object({
    title: z.string().min(1, "Tiêu đề bộ truyện là bắt buộc"),
    alternativeTitles: z.array(z.string()).optional(),
    authors: z.array(z.string()).optional(),
    startTime: z.string().transform((value) => (value === "" ? null : value)),
    synopsis: z.string().min(1, "Nội dung bộ truyện là bắt buộc"),
    genres: z.array(z.number()).min(1, "Ít nhất một thể loại là bắt buộc"),
    status: z.number().int().min(0, "Trạng thái bộ truyện là bắt buộc"),
    categoryRatings: z
        .array(
            z.object({
                option: z.number().int().min(0, "Đánh giá là bắt buộc"),
            }),
        )
        .length(6, "Tất cả 6 đánh giá là bắt buộc"),
});

export default function EditSeriesScreen(props: EditSeriesScreenProps) {
    const router = useRouter();

    const [genres, setGenres] = useState<Genre[]>([]);
    const [selectedGenres, setSelectedGenres] = useState<SelectableItem[]>([]);
    const [seriesData, setSeriesData] = useState<any>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [currentThumbnail, setCurrentThumbnail] = useState<string | null>(null);
    const [thumbnailFileName, setThumbnailFileName] = useState<string | null>("");
    const [thumbnailError, setThumbnailError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [contentRating, setContentRating] = useState<number | null>(null);
    const [acknowledgeRating, setAcknowledgeRating] = useState(false);

    const [isCropperOpen, setIsCropperOpen] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null);
    const [originalFile, setOriginalFile] = useState<File | null>(null);

    const form = useForm({
        resolver: zodResolver(editSeriesSchema),
        defaultValues: {
            title: "",
            alternativeTitles: [],
            authors: [],
            startTime: "",
            synopsis: "",
            seriesType: 0,
            status: 0,
            genres: [0],
            categoryRatings: [
                { category: 1, option: undefined },
                { category: 2, option: undefined },
                { category: 3, option: undefined },
                { category: 4, option: undefined },
                { category: 5, option: undefined },
                { category: 6, option: undefined },
            ],
        },
    });

    const fetchThumbnailUrl = async (filePath: string) => {
        try {
            const response = await fetch(`${env.getBackendHost()}/api/Images/${filePath}?type=thumbnails`, {
                credentials: "include",
            });
            if (response.ok) {
                const thumbnailResponse = await response.json();
                return thumbnailResponse.imageUrl;
            } else {
                console.error("Failed to fetch thumbnail URL", await response.text());
                return null;
            }
        } catch (error) {
            console.error("Error fetching thumbnail URL", error);
            return null;
        }
    };

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await fetch(`${env.getBackendHost()}/api/Genres`);
                if (!response.ok) throw new Error("Failed to fetch genres");
                const data: Genre[] = await response.json();
                setGenres(data);
            } catch (error) {
                console.error("Error fetching genres", error);
            }
        };

        fetchGenres();
    }, []);

    useEffect(() => {
        const fetchSeriesData = async () => {
            try {
                const response = await fetch(`${env.getBackendHost()}/api/AuthorStudio/series/${props.seriesId}`, {
                    credentials: "include",
                });
                if (response.ok) {
                    const seriesData = await response.json();

                    setCurrentThumbnail(seriesData.thumbnail);

                    if (seriesData.thumbnail) {
                        const thumbnailUrl = await fetchThumbnailUrl(seriesData.thumbnail);
                        setThumbnailPreview(thumbnailUrl);
                    }
                    console.log(seriesData, "seriesData");
                    setSeriesData(seriesData);
                }
            } catch (error) {
                console.error("Error fetching series data", error);
            }
        };

        fetchSeriesData();
    }, [props.seriesId]);

    useEffect(() => {
        if (!genres.length || !seriesData) return;
        const categoryMap = {
            Violent: 1,
            Nudity: 2,
            Sexual: 3,
            Profanity: 4,
            Alcohol: 5,
            Sensitive: 6,
        };
        try {
            const mappedCategoryRatings = contentCategories.map((category) => {
                const apiRating = seriesData.categoryRatings.find(
                    (rating: { category: string; option: number }) =>
                        rating.category.toLowerCase() === category.id.toLowerCase(),
                );

                const categoryId = categoryMap[category.id as keyof typeof categoryMap] || 0;

                return {
                    category: categoryId,
                    option: apiRating ? apiRating.option : undefined,
                };
            });

            const processedSelectedGenres = seriesData.genres
                .map((genreName: string) => {
                    const matchedGenre = genres.find((g) => g.name.toLowerCase() === genreName.toLowerCase());
                    return matchedGenre ? { value: matchedGenre.id, label: matchedGenre.name } : null;
                })
                .filter(Boolean) as SelectableItem[];

            const genreIds = processedSelectedGenres.map((genre) => genre.value);

            form.reset({
                title: seriesData.title,
                alternativeTitles: seriesData.alternativeTitles || [],
                authors: seriesData.authors || [],
                startTime: seriesData.startTime || "",
                synopsis: seriesData.synopsis,
                seriesType: seriesData.type,
                status: seriesData.status,
                genres: genreIds,
                categoryRatings: mappedCategoryRatings,
            });

            setSelectedGenres(processedSelectedGenres);
            if (seriesData.thumbnail) {
                fetchThumbnailUrl(seriesData.thumbnail).then((url) => {
                    if (url) setThumbnailPreview(url);
                });
            }
        } catch (error) {
            console.error("Error processing series data", error);
        } finally {
            setIsLoading(false);
        }
    }, [genres, seriesData, form]);

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    };

    const validateThumbnail = (file: File): Promise<boolean> => {
        return new Promise((resolve) => {
            if (file.size > 2 * 1024 * 1024) {
                setThumbnailError("Kích thước ảnh phải nhỏ hơn 2MB");
                resolve(false);
                return;
            }
            resolve(true);
        });
    };

    const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            handleFileUpload(files[0]);
        }
    };

    const handleFileUpload = async (file: File) => {
        const isValid = await validateThumbnail(file);
        if (!isValid) {
            return;
        }

        setOriginalFile(file);
        setThumbnailPreview(URL.createObjectURL(file));
        setIsCropperOpen(true);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const onSubmit = async (data: any) => {
        try {
            const payload = {
                id: props.seriesId,
                title: data.title,
                alternativeTitles: data.alternativeTitles,
                authors: data.authors,
                startTime: data.startTime,
                synopsis: data.synopsis,
                ...(thumbnailFileName ? { thumbnail: thumbnailFileName } : { thumbnail: currentThumbnail }),
                seriesStatus: data.status,
                genres: selectedGenres.map((genre) => genre.value),
                categoryRatings: data.categoryRatings.map(
                    (rating: { category: number; option: number }, index: number) => ({
                        category: index + 1,
                        option: rating.option,
                    }),
                ),
            };
            console.log(payload, "payload");

            const response = await fetch(`${env.getBackendHost()}/api/AuthorStudio/series/${props.seriesId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                toast.success("Truyện cập nhật thành công!");
                router.push("/author-studio/series");
            } else {
                let errorMessage = "Failed to update series";
                try {
                    const errorData = await response.text();
                    if (errorData) {
                        errorMessage = JSON.parse(errorData).message || errorMessage;
                    }
                } catch (e) {
                    console.error("Error parsing error response", e);
                }
                toast.error(errorMessage);
            }
        } catch (error) {
            console.error("Error updating series", error);
            toast.error("Failed to update series. Please try again.");
        }
    };

    const calculateContentRating = (ratings: (number | undefined)[]): number | null => {
        const validRatings = ratings.filter((r): r is number => r !== undefined);
        if (validRatings.length === 0) return null;
        const maxRating = Math.max(...validRatings);
        if (maxRating === 3) return 3;
        if (maxRating === 2) return 2;
        if (maxRating === 1) return 1;
        return 0;
    };

    const categoryRatings = useWatch({
        control: form.control,
        name: "categoryRatings",
    });

    useEffect(() => {
        if (categoryRatings && categoryRatings.length > 0) {
            const ratings = categoryRatings.map((r) => r.option);
            const calculatedRating = calculateContentRating(ratings);
            setContentRating(calculatedRating);
        } else {
            setContentRating(null);
        }
    }, [categoryRatings]);

    const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleCropConfirm = async () => {
        if (!thumbnailPreview || !croppedAreaPixels || !originalFile) return;

        try {
            const croppedImage = await getCroppedImg(thumbnailPreview, croppedAreaPixels);
            const croppedFile = new File([croppedImage], originalFile.name, { type: "image/jpeg" });

            const formData = new FormData();
            formData.append("file", croppedFile);

            const response = await fetch(`${env.getBackendHost()}/api/AuthorStudio/series/thumbnails`, {
                method: "POST",
                body: formData,
                credentials: "include",
            });

            if (response.ok) {
                const thumbnailData = await response.json();
                setThumbnailFileName(thumbnailData.fileName);
                setThumbnailPreview(URL.createObjectURL(croppedImage));
                setThumbnailError(null);
            } else {
                console.error("Failed to upload thumbnail", await response.text());
                setThumbnailError("Failed to upload thumbnail, please check the requirements!");
            }
        } catch (error) {
            console.error("Failed to crop/upload image:", error);
            setThumbnailError("Failed to process image");
        }

        setIsCropperOpen(false);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <SiteLayout>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto max-w-6xl px-4 py-10">
                    <Breadcrumb className="mb-4">
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/" className="flex items-center">
                                    <Home className="mr-2 h-4 w-4" />
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/author-studio">Xưởng Truyện</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/author-studio/series">Bộ truyện</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Sửa Bộ truyện</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 lg:gap-x-24">
                        <div className="space-y-4 lg:col-span-1">
                            <p className="text-lg">Hình Ảnh Thu Nhỏ</p>
                            <div
                                className="flex items-center justify-center"
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                            >
                                <Label className="block text-center text-sm font-medium">
                                    {thumbnailPreview ? (
                                        <div className="relative aspect-[3/4] w-auto rounded-lg border-2 border-dashed border-gray-300">
                                            <Image
                                                src={thumbnailPreview}
                                                alt="Thumbnail Preview"
                                                className="absolute inset-0 h-full w-full object-cover"
                                                fill
                                                priority={true}
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        </div>
                                    ) : (
                                        <div className="relative aspect-[3/4] w-auto rounded-lg border-2 border-dashed border-gray-300 px-14 py-20">
                                            <p className="flex h-full items-center justify-center text-gray-500">
                                                Kéo và thả hình ảnh vào đây hoặc nhấp để chọn.
                                            </p>
                                        </div>
                                    )}
                                    <Input
                                        type="file"
                                        className="hidden"
                                        accept="image/jpeg, image/png"
                                        onChange={handleFileInputChange}
                                    />
                                    <div className="mt-2 lg:text-left">
                                        <p className="text-sm text-gray-500">
                                            Hình ảnh phải có tỷ lệ 3:4.
                                            <br /> Kích thước tối đa là 2MB.
                                            <br /> Chỉ chấp nhận định dạng JPG, JPEG và PNG.
                                        </p>
                                        {thumbnailError && <p className="text-sm text-red-500">{thumbnailError}</p>}
                                    </div>
                                </Label>
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-6 lg:col-span-3">
                            {/* Series Title */}
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-lg">
                                            Tiêu Đề <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input type="text" placeholder="Nhập tiêu đề bộ truyện" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="alternativeTitles"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-lg">Tiêu Đề Phụ</FormLabel>
                                        <FormControl>
                                            <TagsInput value={field.value} onChange={field.onChange} />
                                        </FormControl>
                                        <FormDescription>
                                            Thêm các tiêu đề thay thế cho bộ truyện của bạn. Nhấn Enter sau mỗi tiêu đề.
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="authors"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-lg">Tác Giả</FormLabel>
                                        <FormControl>
                                            <TagsInput value={field.value} onChange={field.onChange} />
                                        </FormControl>
                                        <FormDescription>
                                            Thêm tên các tác giả của bộ truyện. Nhấn Enter sau mỗi tên.
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="startTime"
                                render={({ field }) => {
                                    const formattedDate = field.value
                                        ? new Date(field.value).toISOString().slice(0, 16)
                                        : "";

                                    return (
                                        <FormItem>
                                            <FormLabel className="text-lg">Thời Gian Bắt Đầu</FormLabel>
                                            <FormControl>
                                                <Input type="datetime-local" {...field} value={formattedDate} />
                                            </FormControl>
                                            <FormDescription>Chọn thời gian bắt đầu xuất bản truyện.</FormDescription>
                                        </FormItem>
                                    );
                                }}
                            />

                            {/* Series Type */}
                            <FormField
                                control={form.control}
                                name="seriesType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-lg">
                                            Loại Truyện <span className="text-sm italic text-red-500">Chỉ đọc</span>
                                        </FormLabel>
                                        <FormControl>
                                            <RadioGroup value={String(field.value)} className="flex space-x-4" disabled>
                                                <RadioGroupItem
                                                    value="1"
                                                    id="novel"
                                                    checked={field.value === 1}
                                                    disabled
                                                    aria-label="Tiểu thuyết (Chỉ đọc)"
                                                />
                                                <Label
                                                    htmlFor="novel"
                                                    className={`${
                                                        field.value === 1 ? "font-medium" : "text-gray-500"
                                                    } cursor-not-allowed`}
                                                    title="Tiểu thuyết (Lựa chọn này không thể thay đổi)"
                                                >
                                                    Tiểu thuyết
                                                </Label>

                                                <RadioGroupItem
                                                    value="2"
                                                    id="comic"
                                                    checked={field.value === 2}
                                                    disabled
                                                    aria-label="Truyện tranh (Chỉ đọc)"
                                                />
                                                <Label
                                                    htmlFor="comic"
                                                    className={`${
                                                        field.value === 2 ? "font-medium" : "text-gray-500"
                                                    } cursor-not-allowed`}
                                                    title="Truyện tranh (Lựa chọn này không thể thay đổi)"
                                                >
                                                    Truyện tranh
                                                </Label>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormDescription>Loại truyện không thể thay đổi sau khi tạo.</FormDescription>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-lg">
                                            Trạng Thái <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <Select
                                            value={String(field.value)}
                                            onValueChange={(value) => {
                                                field.onChange(Number(value));
                                            }}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn trạng thái bộ truyện" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.entries(STATUS_CONFIG).map(([status, config], index) => (
                                                    <SelectItem key={status} value={String(index)}>
                                                        <div className="flex items-center">
                                                            <div className={`mr-2 rounded-full p-1 ${config.color}`}>
                                                                <config.icon className="h-4 w-4" />
                                                            </div>
                                                            {status}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Genres */}
                            <FormField
                                control={form.control}
                                name="genres"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-lg">
                                            Thể Loại <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <FancyMultiSelect
                                                items={genres.map((genre) => ({
                                                    value: genre.id,
                                                    label: genre.name,
                                                }))}
                                                selectedItems={selectedGenres}
                                                onSelectionChange={(newSelectedItems) => {
                                                    setSelectedGenres(newSelectedItems);
                                                    field.onChange(newSelectedItems.map((item) => item.value));
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                        <FormDescription>Chọn từ 1 đến 12 thể loại.</FormDescription>
                                    </FormItem>
                                )}
                            />

                            {/* Synopsis */}
                            <FormField
                                control={form.control}
                                name="synopsis"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-lg">
                                            Tóm Tắt <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea rows={5} placeholder="Nhập tóm tắt ngắn gọn" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                        <FormDescription>Tối đa 5000 ký tự.</FormDescription>
                                    </FormItem>
                                )}
                            />

                            {/* Content Ratings */}
                            <div className="space-y-4">
                                <p className="text-lg font-medium uppercase">
                                    Tự Đánh Giá Nội Dung <span className="text-red-500">*</span>
                                </p>
                                <p className="text-sm leading-5">
                                    Tất cả các series trên DASHITOON đều phải hiển thị Đánh Giá Nội Dung. Với Đánh Giá
                                    Nội Dung công khai, chúng tôi có thể giúp người dùng khám phá nội dung phù hợp với
                                    nhóm tuổi của họ và theo sở thích nội dung. <br />
                                    Để đảm bảo series của bạn nhận được Đánh Giá Nội Dung phù hợp, vui lòng trả lời bảng
                                    câu hỏi dưới đây về nội dung của series. Xin lưu ý rằng đánh giá có thể thay đổi
                                    theo quyết định riêng của DASHITOON mà không cần thông báo trước.
                                    <a
                                        href="https://www.webtoons.com/en/terms/canvasPolicy"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 underline"
                                    >
                                        Chính Sách Cộng Đồng và Hướng Dẫn Tải Lên của DASHITOON
                                    </a>{" "}
                                    vẫn sẽ được giữ nguyên.
                                    <a
                                        href="https://www.webtoons.com/en/notice/detail?noticeNo=3285"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 underline"
                                    >
                                        Hướng Dẫn Đánh Giá Nội Dung
                                    </a>
                                    .
                                </p>

                                {contentCategories.map((category, index) => (
                                    <FormField
                                        key={category.id}
                                        control={form.control}
                                        name={`categoryRatings.${index}.option`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="flex items-center space-x-4">
                                                    <FormLabel className="w-1/2">{category.label}</FormLabel>
                                                    <FormControl className="w-1/2">
                                                        <Select
                                                            value={field.value === undefined ? "" : String(field.value)}
                                                            onValueChange={(value) => field.onChange(Number(value))}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Chọn đánh giá" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectGroup>
                                                                    {category.options.map((option) => (
                                                                        <SelectItem
                                                                            key={option.value}
                                                                            value={String(option.value)}
                                                                        >
                                                                            {`${option.value}: ${option.label}`}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectGroup>
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ))}
                            </div>
                            <div className="mt-4 flex items-center space-x-2">
                                <Checkbox
                                    id="acknowledgeRating"
                                    checked={acknowledgeRating}
                                    onCheckedChange={(checked) => setAcknowledgeRating(checked as boolean)}
                                />
                                <label
                                    htmlFor="acknowledgeRating"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Tôi xác nhận rằng đánh giá nội dung của bộ truyện của tôi là{" "}
                                    {contentRating !== null ? (
                                        <span
                                            className={`font-bold ${RATING_CONFIG_2[contentRating + 1]?.color || "text-gray-500"}`}
                                        >
                                            {RATING_CONFIG_2[contentRating + 1]?.label || "Chưa được đánh giá"}
                                        </span>
                                    ) : (
                                        <span className="bg-gray-500/10 text-gray-500">
                                            &quot;(Vui lòng hoàn thành tự đánh giá ở trên để nhận kết quả)&quot;
                                        </span>
                                    )}
                                    .
                                </label>
                            </div>
                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    className="w-full bg-green-500 text-white"
                                    disabled={!acknowledgeRating}
                                >
                                    Cập Nhật
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </Form>
            <Dialog open={isCropperOpen} onOpenChange={setIsCropperOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <div className="mb-4 text-center text-sm text-muted-foreground">
                        Di chuyển và phóng to/thu nhỏ ảnh để có được tỷ lệ 3:4 tốt nhất
                    </div>
                    <div className="relative h-[400px] w-full overflow-hidden">
                        {thumbnailPreview && (
                            <Cropper
                                image={thumbnailPreview}
                                crop={crop}
                                zoom={zoom}
                                aspect={3 / 4}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                                minZoom={1}
                                maxZoom={3}
                                zoomSpeed={0.1}
                                cropShape="rect"
                                objectFit="contain"
                                restrictPosition={true}
                                classes={{
                                    containerClassName: "relative w-full h-full",
                                    mediaClassName: "object-contain",
                                }}
                                style={{
                                    cropAreaStyle: {
                                        border: "2px solid #fff",
                                    },
                                }}
                            />
                        )}
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => setZoom(Math.max(zoom - 0.1, 0.5))}>
                            -
                        </Button>
                        <div className="flex-1">
                            <Slider
                                value={[zoom]}
                                min={0.5}
                                max={3}
                                step={0.1}
                                onValueChange={(value) => setZoom(value[0])}
                            />
                        </div>
                        <Button variant="outline" size="icon" onClick={() => setZoom(Math.min(zoom + 0.1, 3))}>
                            +
                        </Button>
                    </div>
                    <div className="mt-4 flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsCropperOpen(false)}>
                            Hủy
                        </Button>
                        <Button onClick={handleCropConfirm}>Cắt & Tải lên</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </SiteLayout>
    );
}

export interface EditSeriesScreenProps {
    seriesId: string;
}
