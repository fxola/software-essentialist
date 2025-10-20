import { CreateUserInput } from "@dddforum/shared/src/api/users";
import { faker } from "@faker-js/faker";

export class CreateuserBuilder {
  private props: CreateUserInput;

  constructor() {
    this.props = {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
    };
  }

  withRandomDetails() {
    this.props.email = faker.internet.email();
    this.props.firstName = faker.person.firstName();
    this.props.lastName = faker.person.lastName();
    this.props.firstName = faker.internet.username();
    return this;
  }

  withFirstName(firstName: string) {
    this.props.firstName = firstName;
    return this;
  }

  withLastName(lastName: string) {
    this.props.lastName = lastName;
    return this;
  }
  withEmail(email: string) {
    this.props.email = email;
    return this;
  }

  withUsername(username: string) {
    this.props.username = username;
    return this;
  }

  build() {
    return this.props;
  }
}
