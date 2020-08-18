import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface APILocation {
  country_code: string;
  country_name: string;
  city: string;
  postal: string;
  latitude: number;
  longitude: number;
  IPv4: string;
  state: string;
}

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  constructor(private http: HttpClient) {}

  async getLocation(): Promise<Position | PositionError> {
    if (!navigator.geolocation) {
      return;
    }

    return new Promise((resolve, reject) => {
      const success = (position: Position) => {
        resolve(position);
      };
      const error = (err: PositionError) => {
        console.log(err);
        reject(err);
      };

      navigator.geolocation.getCurrentPosition(success, error);
    });
  }

  getCity(): Promise<string> {
    const path = 'https://geolocation-db.com/json/';
    return this.http
      .get<any>(path)
      .toPromise()
      .then((res: APILocation) => res.city)
      .catch((e) => {
        console.log('error', e);
        return '';
      });
  }
}
