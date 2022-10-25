import { All, Controller, ImATeapotException } from '@nestjs/common';

@Controller()
export class AppController {
  @All('/teapot')
  teapot() {
    throw new ImATeapotException(
      'The requested entity body is short and stout🤔 Tip me over and pour me out🫖',
    );
  }
}
