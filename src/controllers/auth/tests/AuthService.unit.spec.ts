import "reflect-metadata";
import { container } from "tsyringe";
import { Logger } from "../../../core/Logger";
import { UserService } from "../../user/services/UserService";
import sinon from "sinon";
import { authRepositoryStub } from "../../../lib/testing/stubs/authRepositoryStub";
import {
    dummyUser, dummyAdmin, dummyModerator,
    dummyUserRole, dummyAdminRole, dummyModeratorRole
} from "../../../lib/testing/data/dummies";


describe("AuthService", () => {
    describe("assignRoles", () => {
        const logger: Logger = container.resolve(Logger);
        const userService: UserService = new UserService(logger, authRepositoryStub);

        it("should assign user role (user role specified)", async () => {
            await userService.assignRoles(dummyUser.username, [dummyUserRole.name]);
            sinon.assert.calledWithExactly(authRepositoryStub.createUserRole, dummyUser.id, dummyUserRole.id);
        });

        it("should assign user role (no role in args)", async () => {
            await userService.assignRoles(dummyUser.username, null);
            sinon.assert.calledWithExactly(authRepositoryStub.createUserRole, dummyUser.id, dummyUserRole.id);
        });

        it("should assign admin role (admin role specified)", async () => {
            await userService.assignRoles(dummyAdmin.username, [dummyAdminRole.name]);
            sinon.assert.calledWithExactly(authRepositoryStub.createUserRole, dummyAdmin.id, dummyAdminRole.id);
        });

        it("should assign moderator role (moderator role specified)", async () => {
            await userService.assignRoles(dummyModerator.username, [dummyModeratorRole.name]);
            sinon.assert.calledWithExactly(authRepositoryStub.createUserRole, dummyModerator.id, dummyModeratorRole.id);
        });

        it("should not assign role (no created user found)", async () => {
            await expect(userService.assignRoles("", [dummyModeratorRole.name]))
                .rejects.toThrow();
        });

        it("should not assign role (no role found)", async () => {
            await expect(userService.assignRoles("admin", [""]))
                .rejects.toThrow();
        });
    });
});