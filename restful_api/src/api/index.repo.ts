import { UserRepository } from "./users/dao/users.repo";
import pool from "../common/database/postgresql";

const userRepository = new UserRepository(pool)

export const repository = {
    userRepository
}