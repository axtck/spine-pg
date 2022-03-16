import sinon, { SinonStubbedInstance } from "sinon";
import { UserRepository } from "../../../controllers/user/repositories/UserRepository";
import {
    dummyAdmin, dummyAdminRole, dummyModerator,
    dummyModeratorRole, dummyUser, dummyUserRole
} from "../data/dummies";


// auth repository
const authRepositoryStub: SinonStubbedInstance<UserRepository> = sinon.createStubInstance(UserRepository);

// get created user id
authRepositoryStub.selectCreatedUserIdByUsername.withArgs(dummyUser.username).resolves({ id: dummyUser.id });
authRepositoryStub.selectCreatedUserIdByUsername.withArgs(dummyAdmin.username).resolves({ id: dummyAdmin.id });
authRepositoryStub.selectCreatedUserIdByUsername.withArgs(dummyModerator.username).resolves({ id: dummyModerator.id });
authRepositoryStub.selectCreatedUserIdByUsername.withArgs("").resolves(null); // test exception handling 

// get role
authRepositoryStub.selectRoleByName.withArgs(dummyUserRole.name).resolves({ id: dummyUserRole.id });
authRepositoryStub.selectRoleByName.withArgs(dummyAdminRole.name).resolves({ id: dummyAdminRole.id });
authRepositoryStub.selectRoleByName.withArgs(dummyModeratorRole.name).resolves({ id: dummyModeratorRole.id });
authRepositoryStub.selectRoleByName.withArgs("").resolves(null);

// get user
authRepositoryStub.selectUserByUsername.withArgs(dummyUser.username).resolves(dummyUser);
authRepositoryStub.selectUserByUsername.withArgs(dummyAdmin.username).resolves(dummyAdmin);
authRepositoryStub.selectUserByUsername.withArgs(dummyModerator.username).resolves(dummyModerator);
authRepositoryStub.selectUserByUsername.withArgs("").resolves(null);

// get user roles
authRepositoryStub.selectUserRoleNamesByUserId.withArgs(dummyUser.id).resolves([{ name: dummyUserRole.name }]);
authRepositoryStub.selectUserRoleNamesByUserId.withArgs(dummyAdmin.id).resolves([{ name: dummyAdminRole.name }]);
authRepositoryStub.selectUserRoleNamesByUserId.withArgs(dummyModerator.id).resolves([{ name: dummyModeratorRole.name }]);
authRepositoryStub.selectUserRoleNamesByUserId.withArgs(0).resolves([]);

export {
    authRepositoryStub
};