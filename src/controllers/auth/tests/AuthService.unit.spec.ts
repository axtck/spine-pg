import "reflect-metadata";
import { container } from "tsyringe";
import { Logger } from "../../../core/Logger";
import { AuthService } from "../AuthService";
import sinon from "sinon";
import { authRepositoryStub } from "../../../lib/testing/stubs/authRepositoryStub";
import {
    dummyUser, dummyAdmin, dummyModerator,
    dummyUserRole, dummyAdminRole, dummyModeratorRole
} from "../../../lib/testing/data/dummies";


describe("AuthService", () => {
    describe("assignRoles", () => {
        const logger: Logger = container.resolve(Logger);
        const authService: AuthService = new AuthService(logger, authRepositoryStub);

        it("should assign user role (user role specified)", async () => {
            await authService.assignRoles(dummyUser.username, [dummyUserRole.name]);
            sinon.assert.calledWithExactly(authRepositoryStub.createUserRole, dummyUser.id, dummyUserRole.id);
        });

        it("should assign user role (no role in args)", async () => {
            await authService.assignRoles(dummyUser.username, null);
            sinon.assert.calledWithExactly(authRepositoryStub.createUserRole, dummyUser.id, dummyUserRole.id);
        });

        it("should assign admin role (admin role specified)", async () => {
            await authService.assignRoles(dummyAdmin.username, [dummyAdminRole.name]);
            sinon.assert.calledWithExactly(authRepositoryStub.createUserRole, dummyAdmin.id, dummyAdminRole.id);
        });

        it("should assign moderator role (moderator role specified)", async () => {
            await authService.assignRoles(dummyModerator.username, [dummyModeratorRole.name]);
            sinon.assert.calledWithExactly(authRepositoryStub.createUserRole, dummyModerator.id, dummyModeratorRole.id);
        });

        it("should not assign role (no created user found)", async () => {
            await expect(authService.assignRoles("", [dummyModeratorRole.name]))
                .rejects.toThrow();
        });

        it("should not assign role (no role found)", async () => {
            await expect(authService.assignRoles("admin", [""]))
                .rejects.toThrow();
        });
    });
});