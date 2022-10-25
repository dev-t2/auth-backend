import { All, Controller, Get, ImATeapotException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('ROOT')
@Controller()
export class AppController {
  @Get()
  root() {
    return 'The address of "/teapot" is... 🤐';
  }

  @All('/teapot')
  teapot() {
    throw new ImATeapotException(
      'The requested entity body is short and stout 🤔 Tip me over and pour me out 🫖',
    );
  }
}
