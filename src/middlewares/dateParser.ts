import { Request, Response, NextFunction } from "express";

/**
 * Recursively converts ISO date strings in the request body to Date objects.
 */
export function dateParser(req: Request, res: Response, next: NextFunction) {
  function convertDates(obj: any): any {
    if (!obj || typeof obj !== "object") return obj;

    for (const key of Object.keys(obj)) {
      const value = obj[key];

      // If it's a string and looks like an ISO date → convert to Date
      if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/.test(value)) {
        obj[key] = new Date(value);
      }

      // If it's a nested object/array → recurse
      else if (typeof value === "object") {
        convertDates(value);
      }
    }

    return obj;
  }

  if (req.body) {
    req.body = convertDates(req.body);
  }

  next();
}
