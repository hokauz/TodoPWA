import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

class AddressGoogleAPI {
  number: string;
  route: string;
  district: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  formatted: string;
  googlePlaceID: string;

  lat: number;
  lng: number;

  constructor(
    number?: string,
    route?: string,
    district?: string,
    city?: string,
    state?: string,
    postalCode?: string,
    country?: string,
    formatted?: string,
    lat?: number,
    lng?: number,
    googlePlaceID?: string
  ) {
    this.number = number;
    this.route = route;
    this.district = district;
    this.city = city;
    this.state = state;
    this.postalCode = postalCode;
    this.country = country;
    this.formatted = formatted;
    this.lat = lat;
    this.lng = lng;
    this.googlePlaceID = googlePlaceID;
  }
}

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

  private async getLocation(): Promise<Position | PositionError> {
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
      const opts = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      };
      navigator.geolocation.getCurrentPosition(success, error, opts);
    });
  }

  async getCity(): Promise<string> {
    if (!navigator.geolocation) {
      return '';
    }

    const key = environment.google_api_key;
    if (!key) {
      return this.getCityFromAPI();
    }

    return this.getLocation().then((loc: Position) =>
      this.getCityFromGoogle(loc.coords.latitude, loc.coords.longitude, key)
    );
  }

  private async getCityFromGoogle(lat: number, lng: number, key: string) {
    const path = `https://maps.googleapis.com/maps/api/geocode/json?&key=${key}&language=pt_BR&latlng=${lat},${lng}`;
    return this.http
      .get(path)
      .toPromise()
      .then((res) => this.fromMap(res))
      .then((address) => address.city)
      .catch((e) => {
        console.log('[Get Location from google]', e);
        return '';
      });
  }

  private async getCityFromAPI(): Promise<string> {
    const path = 'https://geolocation-db.com/json/';
    return this.http
      .get<any>(path)
      .toPromise()
      .then((res: APILocation) => res.city)
      .catch((e) => {
        console.log('[Get Location from api]', e);
        return '';
      });
  }

  private fromMap(res: any): AddressGoogleAPI {
    let address = new AddressGoogleAPI();
    if (res['status'] != 'OK') {
      return address;
    }

    let result = res['results'];
    if (!result) {
      return address;
    }
    result = result[0];

    const city = result['address_components'].find((item) => item.types.includes('administrative_area_level_2'));
    address.city = city['long_name'];
    address.googlePlaceID = result['place_id'];
    return address;
  }
}
