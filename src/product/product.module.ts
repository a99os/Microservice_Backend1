import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    ClientsModule.register([
      {
        name: 'Product_Service',
        transport: Transport.RMQ,
        options: {
          urls: [
            'amqps://fvehfrmn:huZU1LlMtNGwv7q6EIyc7Ajhc4naPcnh@hawk.rmq.cloudamqp.com/fvehfrmn',
          ],
          queue: 'main_products_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
