﻿using DashiToon.Api.Application.Common.Interfaces;
using DashiToon.Api.Domain.Entities;
using DashiToon.Api.Domain.Events;

namespace DashiToon.Api.Application.Reviews.EventHandlers.UserReviewed;

public sealed class UserReviewedEventHandler : INotificationHandler<UserReviewedEvent>
{
    private readonly IApplicationDbContext _context;
    private readonly IModerationService _moderationService;

    public UserReviewedEventHandler(
        IApplicationDbContext context,
        IModerationService moderationService)
    {
        _context = context;
        _moderationService = moderationService;
    }

    public async Task Handle(UserReviewedEvent notification, CancellationToken cancellationToken)
    {
        ModerationAnalysis? analysis = await _moderationService.ModerateReview(notification.Review.Content);

        if (!analysis.Flagged)
        {
            return;
        }

        Report? report = Report.CreateNewSystemReport(ReportType.Review, notification.Review.Id);

        report.AddAnalytics(analysis);

        _context.Reports.Add(report);

        await _context.SaveChangesAsync(cancellationToken);
    }
}