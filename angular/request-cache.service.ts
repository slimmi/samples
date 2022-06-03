import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse } from '@angular/common/http';

export interface RequestCacheEntry {
  url: string;
  response: HttpResponse<any>;
  lastRead: number;
}

export abstract class RequestCache {
  abstract get(req: HttpRequest<any>): HttpResponse<any> | undefined;
  abstract put(req: HttpRequest<any>, response: HttpResponse<any>): void;
}

// Maximum cache age (ms)
const maxAge = 30000;

@Injectable()
export class RequestCacheWithMap implements RequestCache {

  private cache = new Map<string, RequestCacheEntry>();

  constructor() {}

  public get(req: HttpRequest<any>): HttpResponse<any> | undefined {
    const url = req.urlWithParams;
    const cached = this.cache.get(url);

    if (!cached) {
      return undefined;
    }

    const isExpired = cached.lastRead < (Date.now() - maxAge);

    return isExpired ? undefined : cached.response;
  }

  public put(req: HttpRequest<any>, response: HttpResponse<any>): void {
    const url = req.urlWithParams;
    const newEntry = {url, response, lastRead: Date.now()};
    const expired = Date.now() - maxAge;

    this.cache.set(url, newEntry);

    this.cache.forEach(entry => {
      if (entry.lastRead < expired) {
        this.cache.delete(entry.url);
      }
    });
  }
}
