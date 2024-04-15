import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class AllotmentBaseApiService {
  constructor(private readonly httpService: HttpService) {}

  async post<TPayload, TResponse>(
    url: string,
    payload?: TPayload,
    headers?,
  ): Promise<TResponse> {
    const response = await firstValueFrom(
      this.httpService.post<TResponse>(`${url}`, payload, { headers }).pipe(
        catchError(async (e) => {
          Logger.error(JSON.stringify(e?.response?.data, e?.response?.status));
        }),
      ),
    );
    console.log('🚀 ~ AllotmentBaseApiService ~ payload:', payload);
    console.log('🚀 ~ AllotmentBaseApiService ~ url:', url);
    console.log('🚀 ~ AllotmentBaseApiService ~ headers:', headers);
    // console.log('response :', response);
    if (response) {
      return response['data'];
    }
  }

  async get<TResponse>(url: string, headers?): Promise<TResponse> {
    const response = await firstValueFrom(
      this.httpService
        .get<TResponse>(`${url}`, {
          headers,
        })
        .pipe(
          catchError(async (e) => {
            Logger.error(JSON.stringify(e.response.data, e.response.status));
          }),
        ),
    );
    return response['data'];
  }
}
