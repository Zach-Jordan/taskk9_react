import React from 'react';
import { Link } from 'react-router-dom';

export default function DashboardNav() {
    return (
        <>
        <ul>
            <li><Link to='/dashboardPosts'>Posts</Link></li>
            <li><Link to='/dashboardCreate'>Create Post</Link></li>
            <li><Link to='/dashboardManage'>Manage Post</Link></li>
        </ul>
        </>
    )
}