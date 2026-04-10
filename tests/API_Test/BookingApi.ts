import { APIRequestContext } from '@playwright/test';

export class BookingApi {
  readonly request: APIRequestContext;
  readonly baseUrl = 'https://restful-booker.herokuapp.com';

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async createBooking(firstname: string, lastname: string) {
    const response = await this.request.post(`${this.baseUrl}/booking`, {
      data: {
        firstname: firstname,
        lastname: lastname,
        totalprice: 150,
        depositpaid: true,
        bookingdates: {
          checkin: '2024-05-01',
          checkout: '2024-05-10',
        },
        additionalneeds: 'Breakfast',
      },
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    return response;
  }

  async getBooking(bookingId: number) {
    const response = await this.request.get(`${this.baseUrl}/booking/${bookingId}`, {
      headers: { 'Accept': 'application/json' },
    });
    return response;
  }
}
