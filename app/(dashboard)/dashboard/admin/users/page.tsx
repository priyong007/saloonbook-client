import { getUsers } from '@/lib/api/user';
import React from 'react';

const AdminUsersPage = async() => {

    const users = await getUsers()
    return (
        <div>
            <h2>users page</h2>
        </div>
    );
};

export default AdminUsersPage;