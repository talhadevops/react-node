import { mergeConfig } from '@vendure/core';
import { createTestEnvironment, SimpleGraphQLClient } from '@vendure/testing';
import { fail } from 'assert';
import gql from 'graphql-tag';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';

import * as Codegen from './graphql/generated-e2e-admin-types';
import { Permission } from './graphql/generated-e2e-shop-types';
import { CREATE_ADMINISTRATOR, CREATE_ROLE, UPDATE_PRODUCT } from './graphql/shared-definitions';

describe('Custom field permissions', () => {
    const { server, adminClient, shopClient } = createTestEnvironment(
        mergeConfig(testConfig(), {
            customFields: {
                Product: [
                    {
                        name: 'publicField',
                        type: 'string',
                        public: true,
                        defaultValue: 'publicField Value',
                    },
                    {
                        name: 'authenticatedField',
                        type: 'string',
                        defaultValue: 'authenticatedField Value',
                        public: true,
                        requiresPermission: Permission.Authenticated,
                    },
                    {
                        name: 'updateProductField',
                        type: 'string',
                        defaultValue: 'updateProductField Value',
                        public: true,
                        requiresPermission: Permission.UpdateProduct,
                    },
                    {
                        name: 'updateProductOrCustomerField',
                        type: 'string',
                        defaultValue: 'updateProductOrCustomerField Value',
                        public: false,
                        requiresPermission: [Permission.UpdateProduct, Permission.UpdateCustomer],
                    },
                    {
                        name: 'superadminField',
                        type: 'string',
                        defaultValue: 'superadminField Value',
                        public: false,
                        requiresPermission: Permission.SuperAdmin,
                    },
                ],
            },
        }),
    );

    let readProductUpdateProductAdmin: Codegen.CreateAdministratorMutation['createAdministrator'];
    let readProductUpdateCustomerAdmin: Codegen.CreateAdministratorMutation['createAdministrator'];

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-full.csv'),
            customerCount: 3,
        });
        await adminClient.asSuperAdmin();

        readProductUpdateProductAdmin = await createAdminWithPermissions({
            adminClient,
            name: 'ReadProductUpdateProduct',
            permissions: [Permission.ReadProduct, Permission.UpdateProduct],
        });
        readProductUpdateCustomerAdmin = await createAdminWithPermissions({
            adminClient,
            name: 'ReadProductUpdateCustomer',
            permissions: [Permission.ReadProduct, Permission.UpdateCustomer],
        });
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    const GET_PRODUCT_WITH_CUSTOM_FIELDS = gql(`
            query {
                product(id: "T_1") {
                    id
                    customFields {
                        publicField
                        authenticatedField
                        updateProductField
                        updateProductOrCustomerField
                        superadminField
                    }
                }
            }
        `);

    it('readProductUpdateProductAdmin can read public and updateProduct custom fields', async () => {
        await adminClient.asUserWithCredentials(readProductUpdateProductAdmin.emailAddress, 'test');

        const { product } = await adminClient.query(GET_PRODUCT_WITH_CUSTOM_FIELDS, {
            id: 'T_1',
        });

        expect(product.customFields).toEqual({
            publicField: 'publicField Value',
            authenticatedField: 'authenticatedField Value',
            updateProductField: 'updateProductField Value',
            updateProductOrCustomerField: 'updateProductOrCustomerField Value',
            superadminField: null,
        });
    });

    it('readProductUpdateCustomerAdmin can read public and updateCustomer custom fields', async () => {
        await adminClient.asUserWithCredentials(readProductUpdateCustomerAdmin.emailAddress, 'test');

        const { product } = await adminClient.query(GET_PRODUCT_WITH_CUSTOM_FIELDS, {
            id: 'T_1',
        });

        expect(product.customFields).toEqual({
            publicField: 'publicField Value',
            authenticatedField: 'authenticatedField Value',
            updateProductField: null,
            updateProductOrCustomerField: 'updateProductOrCustomerField Value',
            superadminField: null,
        });
    });

    it('superadmin can read all custom fields', async () => {
        await adminClient.asSuperAdmin();

        const { product } = await adminClient.query(GET_PRODUCT_WITH_CUSTOM_FIELDS, {
            id: 'T_1',
        });

        expect(product.customFields).toEqual({
            publicField: 'publicField Value',
            authenticatedField: 'authenticatedField Value',
            updateProductField: 'updateProductField Value',
            updateProductOrCustomerField: 'updateProductOrCustomerField Value',
            superadminField: 'superadminField Value',
        });
    });

    it('superadmin can update all custom fields', async () => {
        await adminClient.asSuperAdmin();
        await adminClient.query<Codegen.UpdateProductMutation, Codegen.UpdateProductMutationVariables>(
            UPDATE_PRODUCT,
            {
                input: {
                    id: 'T_1',
                    customFields: {
                        publicField: 'new publicField Value',
                        authenticatedField: 'new authenticatedField Value',
                        updateProductField: 'new updateProductField Value',
                        updateProductOrCustomerField: 'new updateProductOrCustomerField Value',
                        superadminField: 'new superadminField Value',
                    },
                },
            },
        );

        const { product } = await adminClient.query(GET_PRODUCT_WITH_CUSTOM_FIELDS, {
            id: 'T_1',
        });

        expect(product.customFields).toEqual({
            publicField: 'new publicField Value',
            authenticatedField: 'new authenticatedField Value',
            updateProductField: 'new updateProductField Value',
            updateProductOrCustomerField: 'new updateProductOrCustomerField Value',
            superadminField: 'new superadminField Value',
        });
    });

    it('readProductUpdateProductAdmin can update updateProduct custom field', async () => {
        await adminClient.asUserWithCredentials(readProductUpdateProductAdmin.emailAddress, 'test');
        await adminClient.query<Codegen.UpdateProductMutation, Codegen.UpdateProductMutationVariables>(
            UPDATE_PRODUCT,
            {
                input: {
                    id: 'T_1',
                    customFields: {
                        updateProductField: 'new updateProductField Value 2',
                    },
                },
            },
        );

        const { product } = await adminClient.query(GET_PRODUCT_WITH_CUSTOM_FIELDS, {
            id: 'T_1',
        });

        expect(product.customFields.updateProductField).toBe('new updateProductField Value 2');
    });

    it('readProductUpdateProductAdmin cannot update superadminField', async () => {
        await adminClient.asUserWithCredentials(readProductUpdateProductAdmin.emailAddress, 'test');
        try {
            const result = await adminClient.query<
                Codegen.UpdateProductMutation,
                Codegen.UpdateProductMutationVariables
            >(UPDATE_PRODUCT, {
                input: {
                    id: 'T_1',
                    customFields: {
                        superadminField: 'new superadminField Value 2',
                    },
                },
            });
            fail('Should have thrown');
        } catch (e: any) {
            expect(e.message).toBe(
                'You do not have the required permissions to update the "superadminField" field',
            );
        }
    });

    // This will throw anyway because the user does not have permission to even
    // update the Product at all.
    it('readProductUpdateCustomerAdmin cannot update updateProductField', async () => {
        await adminClient.asUserWithCredentials(readProductUpdateCustomerAdmin.emailAddress, 'test');
        try {
            const result = await adminClient.query<
                Codegen.UpdateProductMutation,
                Codegen.UpdateProductMutationVariables
            >(UPDATE_PRODUCT, {
                input: {
                    id: 'T_1',
                    customFields: {
                        updateProductField: 'new updateProductField Value 2',
                    },
                },
            });
            fail('Should have thrown');
        } catch (e: any) {
            expect(e.message).toBe('You are not currently authorized to perform this action');
        }
    });

    describe('Shop API', () => {
        const GET_PRODUCT_WITH_PUBLIC_CUSTOM_FIELDS = gql(`
            query {
                product(id: "T_1") {
                    id
                    customFields {
                        publicField
                        authenticatedField
                        updateProductField
                    }
                }
            }
        `);

        it('all public fields are accessible in Shop API regardless of permissions', async () => {
            await shopClient.asAnonymousUser();

            const { product } = await shopClient.query(GET_PRODUCT_WITH_PUBLIC_CUSTOM_FIELDS, {
                id: 'T_1',
            });

            expect(product.customFields).toEqual({
                publicField: 'new publicField Value',
                authenticatedField: 'new authenticatedField Value',
                updateProductField: 'new updateProductField Value 2',
            });
        });
    });
});

async function createAdminWithPermissions(input: {
    adminClient: SimpleGraphQLClient;
    name: string;
    permissions: Permission[];
}) {
    const { adminClient, name, permissions } = input;
    const { createRole } = await adminClient.query<
        Codegen.CreateRoleMutation,
        Codegen.CreateRoleMutationVariables
    >(CREATE_ROLE, {
        input: {
            code: name,
            description: name,
            permissions,
        },
    });

    const { createAdministrator } = await adminClient.query<
        Codegen.CreateAdministratorMutation,
        Codegen.CreateAdministratorMutationVariables
    >(CREATE_ADMINISTRATOR, {
        input: {
            firstName: name,
            lastName: 'LastName',
            emailAddress: `${name}@test.com`,
            roleIds: [createRole.id],
            password: 'test',
        },
    });
    return createAdministrator;
}
