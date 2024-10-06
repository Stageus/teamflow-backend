import { UserService } from "./users/users.service";
import { repository } from "./index.repo";
import pool from "../common/database/postgresql";

const userService = new UserService(repository.userRepository, pool)

export const service = {
    userService
}