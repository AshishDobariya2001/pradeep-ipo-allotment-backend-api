// import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
// import { Users } from './Users';
// import { Contacts } from './Contacts';

// @Entity('user_contact', { schema: 'public' })
// export class UserContact {
//   @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
//   id: number;

//   @ManyToOne(() => Users, (users) => users.id, { onDelete: 'CASCADE' })
//   @JoinColumn({ name: 'user_id' })
//   user: Users;

//   @ManyToOne(() => Contacts, (contacts) => contacts.id, { onDelete: 'CASCADE' })
//   @JoinColumn({ name: 'contact_id' })
//   contact: Contacts;
// }
