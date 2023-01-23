import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const Category = React.lazy(() => import('./views/category/Category'));
const Product = React.lazy(() => import('./views/product/Product'));
const Tag = React.lazy(() => import('./views/tag/Tag'));
const Customer = React.lazy(() => import('./views/customer/Customer'));
const Tracking = React.lazy(() => import('./views/tracking/Tracking'));
const Traffic_Source = React.lazy(() => import('./views/traffic_source/Traffic_Source'));
const User = React.lazy(() => import('./views/user/User'));
const Activity = React.lazy(() => import('./views/activity/Activity'));
const System = React.lazy(() => import('./views/system/System'));
const SEO = React.lazy(() => import('./views/seo/SEO'));
const Comment = React.lazy(() => import('./views/comment/Comment'));
const GoogleTrend = React.lazy(() => import('./views/dashboard/GoogleTrend'));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/categories', name: 'Danh mục sản phẩm', element: Category },
  { path: '/categories/:action/:id', name: 'Danh mục sản phẩm', element: Category },
  { path: '/products', name: 'Danh sách sản phẩm', element: Product },
  { path: '/products/:action/:id', name: 'Danh sách sản phẩm', element: Product },
  { path: '/tags', name: 'Danh sách từ khóa', element: Tag },
  { path: '/tags/:action/:id', name: 'Danh sách từ khóa', element: Tag },
  { path: '/customers', name: 'Khách hàng', element: Customer },
  { path: '/customers/:action/:id', name: 'Khách hàng', element: Customer },
  { path: '/trackings', name: 'Theo dõi người dùng', element: Tracking },
  { path: '/trackings/:action/:id', name: 'Theo dõi người dùng', element: Tracking },
  { path: '/traffic_sources', name: 'Nguồn đăng ký tài khoản', element: Traffic_Source },
  { path: '/traffic_sources/:action/:id', name: 'Nguồn đăng ký tài khoản', element: Traffic_Source },
  { path: '/users', name: 'Danh sách quản lý', element: User },
  { path: '/users/:action/:id', name: 'Danh sách quản lý', element: User },
  { path: '/activities', name: 'Thống kê hoạt động', element: Activity },
  { path: '/activities/:action/:id', name: 'Thống kê hoạt động', element: Activity },
  { path: '/systems', name: 'Hệ thống', element: System },
  { path: '/systems/:action/:id', name: 'Hệ thống', element: System },
  { path: '/seo', name: 'seo.breadcrumb', element: SEO },
  { path: '/seo/:action/:id', name: 'SEO', element: SEO },
  { path: '/comments', name: 'Bình luận', element: Comment },
  { path: '/comments/:action/:id', name: 'Bình luận', element: Comment },
  { path: '/google/trend', name: 'Google Trend', element: GoogleTrend }
];

export default routes
