
import { UserDTO, ValidatedUser } from "@dddforum/shared/src/api/users";

export interface UsersRepository {
  findUserByEmail(email: string): Promise<UserDTO | null>;
  save(user: ValidatedUser): Promise<UserDTO>;
  findById(id: number): Promise<UserDTO | null>;
  delete(email: string): Promise<void>;
  findUserByUsername(username: string): Promise<UserDTO | null>;
  update(id: number, props: Partial<ValidatedUser>): Promise<UserDTO | null>;
}
