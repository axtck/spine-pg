import sinon, { SinonStubbedInstance } from "sinon";
import { UserRepository } from "../../../domains/user/info/repositories/UserRepository";
import { dummyUser } from "../data/dummies";

// auth repository
const authRepositoryStub: SinonStubbedInstance<UserRepository> = sinon.createStubInstance(UserRepository);

// get user
authRepositoryStub.selectCredentialsByUsername.withArgs(dummyUser.username).resolves(dummyUser);
authRepositoryStub.selectCredentialsByUsername.withArgs("").resolves(null);

export { authRepositoryStub };
