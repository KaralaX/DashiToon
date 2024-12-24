﻿using System.Reflection;

namespace DashiToon.Api.Web.Infrastructure;

public static class MethodInfoExtensions
{
    public static bool IsAnonymous(this MethodInfo method)
    {
        char[] invalidChars = new[] { '<', '>' };
        return method.Name.Any(invalidChars.Contains);
    }

    public static void AnonymousMethod(this IGuardClause guardClause, Delegate input)
    {
        if (input.Method.IsAnonymous())
        {
            throw new ArgumentException("The endpoint name must be specified when using anonymous handlers.");
        }
    }
}
