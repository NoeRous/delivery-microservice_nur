import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AddressEntity } from "./address.entity";

@Entity('patients')
export class PatientEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: "identity_card" })
    identityCard: string;

    @Column({ name: "first_name" })
    firstName: string;

    @Column({ name: "last_name" })
    lastName: string;

    @Column({ name: "cell_phone" })
    cellPhone: number;

    @OneToMany(() => AddressEntity, (address) => address.patient)
    addresses: AddressEntity[];
}