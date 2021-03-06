import { EntityRepository, Repository } from 'typeorm';
import { Order } from '../../entity/order/order.entity';
import { User } from '../../entity/user/user.entity';

@EntityRepository(Order)
export class OrderRepository extends Repository<Order> {
  async getMyOrders(user: User) {
    const orders = this.createQueryBuilder('order')
      .innerJoinAndSelect('order.cart', 'cart')
      .innerJoinAndSelect('cart.createdBy', 'user')
      .innerJoinAndSelect('cart.cartTickets', 'cartTickets')
      .innerJoinAndSelect('cartTickets.ticket', 'ticket')
      .innerJoinAndSelect('ticket.event', 'event')
      .where(`cart.createdBy = ${user.userId}`)
      .innerJoinAndSelect('user.country', 'country');

    return orders.getManyAndCount();
  }
}
