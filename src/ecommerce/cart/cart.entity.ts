import { Expose } from "class-transformer";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, ObjectID, ObjectIdColumn } from "typeorm"
import { ProductEntity } from "../products/entities/product.entity";

@Entity()
export class CartEntity {
    @ObjectIdColumn()
    @Expose()
    _id: ObjectID;

   @Column()
   total: number

   @Column()
   quantity: number
  
   @ManyToOne(type => ProductEntity, order => order._id)
   @JoinColumn()
   item: ProductEntity

   @ManyToOne(type => User, user => user.username)
   @JoinColumn()
   user: User
}
