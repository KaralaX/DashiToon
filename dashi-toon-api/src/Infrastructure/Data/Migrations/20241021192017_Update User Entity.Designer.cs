﻿// <auto-generated />
using System;
using DashiToon.Api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace DashiToon.Api.Infrastructure.Data.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20241021192017_Update User Entity")]
    partial class UpdateUserEntity
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.2")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("DashiToon.Api.Domain.Entities.Chapter", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("ChapterNumber")
                        .HasColumnType("integer");

                    b.Property<DateTimeOffset>("Created")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("CreatedBy")
                        .HasColumnType("text");

                    b.Property<Guid>("CurrentVersionId")
                        .HasColumnType("uuid");

                    b.Property<DateTimeOffset>("LastModified")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("LastModifiedBy")
                        .HasColumnType("text");

                    b.Property<DateTimeOffset?>("PublishedDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<Guid?>("PublishedVersionId")
                        .HasColumnType("uuid");

                    b.Property<int>("VolumeId")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("VolumeId");

                    b.ToTable("Chapters");
                });

            modelBuilder.Entity("DashiToon.Api.Domain.Entities.Comment", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<int?>("ChapterId")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("ChapterId");

                    b.ToTable("Comment");
                });

            modelBuilder.Entity("DashiToon.Api.Domain.Entities.DashiFan", b =>
                {
                    b.Property<Guid>("Id")
                        .HasColumnType("uuid");

                    b.Property<DateTimeOffset>("Created")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("CreatedBy")
                        .HasColumnType("text");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("character varying(255)");

                    b.Property<bool>("IsActive")
                        .HasColumnType("boolean");

                    b.Property<DateTimeOffset>("LastModified")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("LastModifiedBy")
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("character varying(255)");

                    b.Property<int>("Perks")
                        .HasColumnType("integer");

                    b.Property<int>("SeriesId")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("SeriesId");

                    b.ToTable("DashiFans");
                });

            modelBuilder.Entity("DashiToon.Api.Domain.Entities.Genre", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<DateTimeOffset>("Created")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("CreatedBy")
                        .HasColumnType("text");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTimeOffset>("LastModified")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("LastModifiedBy")
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Genres");
                });

            modelBuilder.Entity("DashiToon.Api.Domain.Entities.Review", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<int?>("SeriesId")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("SeriesId");

                    b.ToTable("Review");
                });

            modelBuilder.Entity("DashiToon.Api.Domain.Entities.Series", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("ContentRating")
                        .HasColumnType("integer");

                    b.Property<DateTimeOffset>("Created")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("CreatedBy")
                        .HasColumnType("text");

                    b.Property<DateTimeOffset>("LastModified")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("LastModifiedBy")
                        .HasColumnType("text");

                    b.Property<int>("Status")
                        .HasColumnType("integer");

                    b.Property<string>("Synopsis")
                        .IsRequired()
                        .HasMaxLength(5000)
                        .HasColumnType("character varying(5000)");

                    b.Property<string>("Thumbnail")
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("character varying(255)");

                    b.Property<int>("Type")
                        .HasColumnType("integer");

                    b.Property<int>("VolumeCount")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.ToTable("Series");
                });

            modelBuilder.Entity("DashiToon.Api.Domain.Entities.Subscription", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTimeOffset>("Created")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("CreatedBy")
                        .HasColumnType("text");

                    b.Property<Guid>("DashiFanId")
                        .HasColumnType("uuid");

                    b.Property<bool>("IsActive")
                        .HasColumnType("boolean");

                    b.Property<DateTimeOffset>("LastModified")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("LastModifiedBy")
                        .HasColumnType("text");

                    b.Property<DateTimeOffset>("NextBillingDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("DashiFanId");

                    b.HasIndex("UserId");

                    b.ToTable("Subscription");
                });

            modelBuilder.Entity("DashiToon.Api.Domain.Entities.Volume", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("ChapterCount")
                        .HasColumnType("integer");

                    b.Property<string>("Introduction")
                        .HasMaxLength(2000)
                        .HasColumnType("character varying(2000)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.Property<int>("SeriesId")
                        .HasColumnType("integer");

                    b.Property<int>("VolumeNumber")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("SeriesId");

                    b.ToTable("Volumes");
                });

            modelBuilder.Entity("DashiToon.Api.Infrastructure.Identity.ApplicationUser", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("text");

                    b.Property<int>("AccessFailedCount")
                        .HasColumnType("integer");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("text");

                    b.Property<string>("Email")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<bool>("EmailConfirmed")
                        .HasColumnType("boolean");

                    b.Property<int>("KanaCoin")
                        .HasColumnType("integer");

                    b.Property<int>("KanaGold")
                        .HasColumnType("integer");

                    b.Property<DateTimeOffset?>("LastCheckin")
                        .HasColumnType("timestamp with time zone");

                    b.Property<bool>("LockoutEnabled")
                        .HasColumnType("boolean");

                    b.Property<DateTimeOffset?>("LockoutEnd")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<string>("PasswordHash")
                        .HasColumnType("text");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("text");

                    b.Property<bool>("PhoneNumberConfirmed")
                        .HasColumnType("boolean");

                    b.Property<string>("SecurityStamp")
                        .HasColumnType("text");

                    b.Property<bool>("TwoFactorEnabled")
                        .HasColumnType("boolean");

                    b.Property<string>("UserName")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedEmail")
                        .HasDatabaseName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasDatabaseName("UserNameIndex");

                    b.ToTable("Users", (string)null);
                });

            modelBuilder.Entity("GenreSeries", b =>
                {
                    b.Property<int>("GenresId")
                        .HasColumnType("integer");

                    b.Property<int>("SeriesId")
                        .HasColumnType("integer");

                    b.HasKey("GenresId", "SeriesId");

                    b.HasIndex("SeriesId");

                    b.ToTable("GenreSeries");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRole", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("text");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasDatabaseName("RoleNameIndex");

                    b.ToTable("Roles", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("ClaimType")
                        .HasColumnType("text");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("text");

                    b.Property<string>("RoleId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("RoleClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("ClaimType")
                        .HasColumnType("text");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("text");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("UserClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.Property<string>("LoginProvider")
                        .HasColumnType("text");

                    b.Property<string>("ProviderKey")
                        .HasColumnType("text");

                    b.Property<string>("ProviderDisplayName")
                        .HasColumnType("text");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("UserLogins", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("text");

                    b.Property<string>("RoleId")
                        .HasColumnType("text");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("UserRoles", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("text");

                    b.Property<string>("LoginProvider")
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .HasColumnType("text");

                    b.Property<string>("Value")
                        .HasColumnType("text");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("UserTokens", (string)null);
                });

            modelBuilder.Entity("DashiToon.Api.Domain.Entities.Chapter", b =>
                {
                    b.HasOne("DashiToon.Api.Domain.Entities.Volume", "Volume")
                        .WithMany("Chapters")
                        .HasForeignKey("VolumeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.OwnsMany("DashiToon.Api.Domain.Entities.ChapterVersion", "Versions", b1 =>
                        {
                            b1.Property<Guid>("Id")
                                .HasColumnType("uuid");

                            b1.Property<int>("ChapterId")
                                .HasColumnType("integer");

                            b1.Property<string>("Content")
                                .IsRequired()
                                .HasColumnType("text");

                            b1.Property<bool>("IsAutoSave")
                                .HasColumnType("boolean");

                            b1.Property<string>("Note")
                                .HasMaxLength(5000)
                                .HasColumnType("character varying(5000)");

                            b1.Property<int>("Status")
                                .HasColumnType("integer");

                            b1.Property<string>("Thumbnail")
                                .HasMaxLength(100)
                                .HasColumnType("character varying(100)");

                            b1.Property<DateTimeOffset>("Timestamp")
                                .HasColumnType("timestamp with time zone");

                            b1.Property<string>("Title")
                                .IsRequired()
                                .HasMaxLength(255)
                                .HasColumnType("character varying(255)");

                            b1.Property<string>("VersionName")
                                .IsRequired()
                                .HasMaxLength(255)
                                .HasColumnType("character varying(255)");

                            b1.HasKey("Id");

                            b1.HasIndex("ChapterId");

                            b1.ToTable("ChapterVersion");

                            b1.WithOwner()
                                .HasForeignKey("ChapterId");
                        });

                    b.Navigation("Versions");

                    b.Navigation("Volume");
                });

            modelBuilder.Entity("DashiToon.Api.Domain.Entities.Comment", b =>
                {
                    b.HasOne("DashiToon.Api.Domain.Entities.Chapter", null)
                        .WithMany("Comments")
                        .HasForeignKey("ChapterId");
                });

            modelBuilder.Entity("DashiToon.Api.Domain.Entities.DashiFan", b =>
                {
                    b.HasOne("DashiToon.Api.Domain.Entities.Series", null)
                        .WithMany("Tiers")
                        .HasForeignKey("SeriesId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.OwnsOne("DashiToon.Api.Domain.ValueObjects.Price", "Price", b1 =>
                        {
                            b1.Property<Guid>("DashiFanId")
                                .HasColumnType("uuid");

                            b1.Property<decimal>("Amount")
                                .HasColumnType("numeric");

                            b1.Property<string>("Currency")
                                .IsRequired()
                                .HasColumnType("text");

                            b1.HasKey("DashiFanId");

                            b1.ToTable("DashiFans");

                            b1.WithOwner()
                                .HasForeignKey("DashiFanId");
                        });

                    b.OwnsOne("DashiToon.Api.Domain.ValueObjects.BillingCycle", "BillingCycle", b1 =>
                        {
                            b1.Property<Guid>("DashiFanId")
                                .HasColumnType("uuid");

                            b1.Property<int>("Interval")
                                .HasColumnType("integer");

                            b1.Property<int>("IntervalCount")
                                .HasColumnType("integer");

                            b1.HasKey("DashiFanId");

                            b1.ToTable("DashiFans");

                            b1.WithOwner()
                                .HasForeignKey("DashiFanId");
                        });

                    b.Navigation("BillingCycle")
                        .IsRequired();

                    b.Navigation("Price")
                        .IsRequired();
                });

            modelBuilder.Entity("DashiToon.Api.Domain.Entities.Review", b =>
                {
                    b.HasOne("DashiToon.Api.Domain.Entities.Series", null)
                        .WithMany("Reviews")
                        .HasForeignKey("SeriesId");
                });

            modelBuilder.Entity("DashiToon.Api.Domain.Entities.Series", b =>
                {
                    b.OwnsMany("DashiToon.Api.Domain.Entities.CategoryRating", "CategoryRatings", b1 =>
                        {
                            b1.Property<int>("Id")
                                .ValueGeneratedOnAdd()
                                .HasColumnType("integer");

                            NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b1.Property<int>("Id"));

                            b1.Property<int>("Category")
                                .HasColumnType("integer");

                            b1.Property<int>("Rating")
                                .HasColumnType("integer");

                            b1.Property<int>("SeriesId")
                                .HasColumnType("integer");

                            b1.HasKey("Id");

                            b1.HasIndex("SeriesId");

                            b1.ToTable("CategoryRating");

                            b1.WithOwner()
                                .HasForeignKey("SeriesId");
                        });

                    b.Navigation("CategoryRatings");
                });

            modelBuilder.Entity("DashiToon.Api.Domain.Entities.Subscription", b =>
                {
                    b.HasOne("DashiToon.Api.Domain.Entities.DashiFan", null)
                        .WithMany("Subscriptions")
                        .HasForeignKey("DashiFanId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("DashiToon.Api.Infrastructure.Identity.ApplicationUser", null)
                        .WithMany("Subscriptions")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.OwnsMany("DashiToon.Api.Domain.Entities.BillingDetail", "BillingDetails", b1 =>
                        {
                            b1.Property<Guid>("SubscriptionId")
                                .HasColumnType("uuid");

                            b1.Property<Guid>("Id")
                                .ValueGeneratedOnAdd()
                                .HasColumnType("uuid");

                            b1.Property<DateTimeOffset>("BillingDate")
                                .HasColumnType("timestamp with time zone");

                            b1.Property<DateTimeOffset>("Created")
                                .HasColumnType("timestamp with time zone");

                            b1.Property<string>("CreatedBy")
                                .HasColumnType("text");

                            b1.Property<bool>("IsPaid")
                                .HasColumnType("boolean");

                            b1.Property<DateTimeOffset>("LastModified")
                                .HasColumnType("timestamp with time zone");

                            b1.Property<string>("LastModifiedBy")
                                .HasColumnType("text");

                            b1.Property<int>("PaymentStatus")
                                .HasColumnType("integer");

                            b1.HasKey("SubscriptionId", "Id");

                            b1.ToTable("BillingDetail");

                            b1.WithOwner()
                                .HasForeignKey("SubscriptionId");

                            b1.OwnsOne("DashiToon.Api.Domain.ValueObjects.Price", "Price", b2 =>
                                {
                                    b2.Property<Guid>("BillingDetailSubscriptionId")
                                        .HasColumnType("uuid");

                                    b2.Property<Guid>("BillingDetailId")
                                        .HasColumnType("uuid");

                                    b2.Property<decimal>("Amount")
                                        .HasColumnType("numeric");

                                    b2.Property<string>("Currency")
                                        .IsRequired()
                                        .HasColumnType("text");

                                    b2.HasKey("BillingDetailSubscriptionId", "BillingDetailId");

                                    b2.ToTable("BillingDetail");

                                    b2.WithOwner()
                                        .HasForeignKey("BillingDetailSubscriptionId", "BillingDetailId");
                                });

                            b1.Navigation("Price")
                                .IsRequired();
                        });

                    b.Navigation("BillingDetails");
                });

            modelBuilder.Entity("DashiToon.Api.Domain.Entities.Volume", b =>
                {
                    b.HasOne("DashiToon.Api.Domain.Entities.Series", "Series")
                        .WithMany("Volumes")
                        .HasForeignKey("SeriesId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Series");
                });

            modelBuilder.Entity("DashiToon.Api.Infrastructure.Identity.ApplicationUser", b =>
                {
                    b.OwnsMany("DashiToon.Api.Domain.Entities.KanaTransaction", "Ledgers", b1 =>
                        {
                            b1.Property<string>("UserId")
                                .HasColumnType("text");

                            b1.Property<Guid>("Id")
                                .HasColumnType("uuid");

                            b1.Property<int>("Amount")
                                .HasColumnType("integer");

                            b1.Property<int>("Currency")
                                .HasColumnType("integer");

                            b1.Property<string>("Reason")
                                .IsRequired()
                                .HasMaxLength(500)
                                .HasColumnType("character varying(500)");

                            b1.Property<DateTimeOffset>("Timestamp")
                                .HasColumnType("timestamp with time zone");

                            b1.Property<int>("Type")
                                .HasColumnType("integer");

                            b1.HasKey("UserId", "Id");

                            b1.ToTable("KanaTransaction");

                            b1.WithOwner()
                                .HasForeignKey("UserId");
                        });

                    b.Navigation("Ledgers");
                });

            modelBuilder.Entity("GenreSeries", b =>
                {
                    b.HasOne("DashiToon.Api.Domain.Entities.Genre", null)
                        .WithMany()
                        .HasForeignKey("GenresId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("DashiToon.Api.Domain.Entities.Series", null)
                        .WithMany()
                        .HasForeignKey("SeriesId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.HasOne("DashiToon.Api.Infrastructure.Identity.ApplicationUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.HasOne("DashiToon.Api.Infrastructure.Identity.ApplicationUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("DashiToon.Api.Infrastructure.Identity.ApplicationUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.HasOne("DashiToon.Api.Infrastructure.Identity.ApplicationUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("DashiToon.Api.Domain.Entities.Chapter", b =>
                {
                    b.Navigation("Comments");
                });

            modelBuilder.Entity("DashiToon.Api.Domain.Entities.DashiFan", b =>
                {
                    b.Navigation("Subscriptions");
                });

            modelBuilder.Entity("DashiToon.Api.Domain.Entities.Series", b =>
                {
                    b.Navigation("Reviews");

                    b.Navigation("Tiers");

                    b.Navigation("Volumes");
                });

            modelBuilder.Entity("DashiToon.Api.Domain.Entities.Volume", b =>
                {
                    b.Navigation("Chapters");
                });

            modelBuilder.Entity("DashiToon.Api.Infrastructure.Identity.ApplicationUser", b =>
                {
                    b.Navigation("Subscriptions");
                });
#pragma warning restore 612, 618
        }
    }
}
