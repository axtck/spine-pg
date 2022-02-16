import sinon, { SinonStubbedInstance } from "sinon";
import { AuthRepository } from "../../../controllers/auth/AuthRepository";
import {
    dummyAdmin, dummyAdminRole, dummyModerator,
    dummyModeratorRole, dummyUser, dummyUserRole
} from "../data/dummies";


// auth repository
const authRepositoryStub: SinonStubbedInstance<AuthRepository> = sinon.createStubInstance(AuthRepository);

// get created user id
authRepositoryStub.getCreatedUserIdByUsername.withArgs(dummyUser.username).resolves({ id: dummyUser.id });
authRepositoryStub.getCreatedUserIdByUsername.withArgs(dummyAdmin.username).resolves({ id: dummyAdmin.id });
authRepositoryStub.getCreatedUserIdByUsername.withArgs(dummyModerator.username).resolves({ id: dummyModerator.id });
authRepositoryStub.getCreatedUserIdByUsername.withArgs("").resolves(null); // test exception handling 

// get role
authRepositoryStub.getRoleByName.withArgs(dummyUserRole.name).resolves({ id: dummyUserRole.id });
authRepositoryStub.getRoleByName.withArgs(dummyAdminRole.name).resolves({ id: dummyAdminRole.id });
authRepositoryStub.getRoleByName.withArgs(dummyModeratorRole.name).resolves({ id: dummyModeratorRole.id });
authRepositoryStub.getRoleByName.withArgs("").resolves(null);

// get user
authRepositoryStub.getUserByUsername.withArgs(dummyUser.username).resolves(dummyUser);
authRepositoryStub.getUserByUsername.withArgs(dummyAdmin.username).resolves(dummyAdmin);
authRepositoryStub.getUserByUsername.withArgs(dummyModerator.username).resolves(dummyModerator);
authRepositoryStub.getUserByUsername.withArgs("").resolves(null);

// get user roles
authRepositoryStub.getUserRoleNamesByUserId.withArgs(dummyUser.id).resolves([{ name: dummyUserRole.name }]);
authRepositoryStub.getUserRoleNamesByUserId.withArgs(dummyAdmin.id).resolves([{ name: dummyAdminRole.name }]);
authRepositoryStub.getUserRoleNamesByUserId.withArgs(dummyModerator.id).resolves([{ name: dummyModeratorRole.name }]);
authRepositoryStub.getUserRoleNamesByUserId.withArgs(0).resolves([]);

export {
    authRepositoryStub
};