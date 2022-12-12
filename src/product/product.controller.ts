import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ClientProxy } from '@nestjs/microservices';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    @Inject('Product_Service') private readonly client: ClientProxy,
  ) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    const product = await this.productService.create(createProductDto);
    console.log(product);
    this.client.emit('product_created', product);
    return product;
  }

  @Get()
  findAll() {
    this.client.emit('hello', 'Hello from another service');
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    await this.productService.update(+id, updateProductDto);
    const product = await this.productService.findOne(+id);
    this.client.emit('product_updated', product);
    return product;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const product = await this.productService.findOne(+id);
    await this.productService.remove(+id);
    this.client.emit('product_deleted', product.id);

    return product;
  }

  @Post(':id/like')
  async likeBoss(@Param('id') id: string) {
    const product = await this.productService.findOne(+id);
    if (!product) {
      throw new NotFoundException('Bunday product topilmadi');
    }

    return this.productService.update(+id, {
      likes: product.likes + 1,
    });
  }
}
