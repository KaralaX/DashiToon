﻿namespace DashiToon.Api.Domain.Common;

public abstract class BaseAuditableEntity<TId> : BaseEntity<TId>, IAuditable
{
    public DateTimeOffset Created { get; set; }
    public string? CreatedBy { get; set; }
    public DateTimeOffset LastModified { get; set; }
    public string? LastModifiedBy { get; set; }
}
