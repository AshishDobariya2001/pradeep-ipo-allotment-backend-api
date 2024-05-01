import { Injectable } from '@nestjs/common';
import { IpoDetailsRepository } from '../repositories';

@Injectable()
export class CemeoIndiaService {
  constructor(private ipoDetailsRepository: IpoDetailsRepository) {}
  // // Function to extract form data from HTML
  // async extractFormData(html) {
  //   const $ = cheerio.load(html);
  //   const formData = {
  //     __VIEWSTATE: $('input[name="__VIEWSTATE"]').val(),
  //     __VIEWSTATEGENERATOR: $('input[name="__VIEWSTATEGENERATOR"]').val(),
  //     __EVENTVALIDATION: $('input[name="__EVENTVALIDATION"]').val(),
  //     drpCompany: 'MKP',
  //     ddlUserTypes: 'PAN NO',
  //     txtfolio: 'FRHPD3254A',
  //     txt_phy_captcha: '478109',
  //     __ASYNCPOST: true,
  //     btngenerate: 'Submit',
  //   };
  //   return formData;
  // }

  // async getdata() {
  //   try {
  //     // Step 1: Load the page to get necessary data
  //     const response = await axios.get('https://ipo.cameoindia.com/');
  //     const html = response.data;

  //     // Step 2: Extract form data from the HTML
  //     const formData = this.extractFormData(html);

  //     // Step 3: Submit the form
  //     const submitResponse = await axios.post(
  //       'https://ipo.cameoindia.com/',
  //       formData,
  //     );

  //     // Step 4: Handle response if needed
  //     console.log(submitResponse.data);
  //   } catch (error) {
  //     // Handle error
  //     console.error('Error submitting form:', error);
  //   }
  // }
}
