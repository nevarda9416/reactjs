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
const DataProduct = React.lazy(() => import('./views/data/Product'));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/categories', name: 'Danh mục sản phẩm', element: Category },
  { path: '/categories/:action/:id', name: 'Danh mục sản phẩm', element: Category },
  { path: '/products', name: 'Danh sách sản phẩm', element: Product },
  { path: '/products/:action/:id', name: 'Danh sách sản phẩm', element: Product },
  { path: '/tags', name: 'tag.breadcrumb', element: Tag },
  { path: '/tags/:action/:id', name: 'tag.breadcrumb', element: Tag },
  { path: '/customers', name: 'customer.breadcrumb', element: Customer },
  { path: '/customers/:action/:id', name: 'customer.breadcrumb', element: Customer },
  { path: '/trackings', name: 'tracking.breadcrumb', element: Tracking },
  { path: '/trackings/:action/:id', name: 'tracking.breadcrumb', element: Tracking },
  { path: '/traffic_sources', name: 'traffic_source.breadcrumb', element: Traffic_Source },
  { path: '/traffic_sources/:action/:id', name: 'traffic_source.breadcrumb', element: Traffic_Source },
  { path: '/users', name: 'user.breadcrumb', element: User },
  { path: '/users/:action/:id', name: 'user.breadcrumb', element: User },
  { path: '/activities', name: 'activity.breadcrumb', element: Activity },
  { path: '/activities/:action/:id', name: 'activity.breadcrumb', element: Activity },
  { path: '/systems', name: 'system.breadcrumb', element: System },
  { path: '/systems/:action/:id', name: 'system.breadcrumb', element: System },
  { path: '/seo', name: 'seo.breadcrumb', element: SEO },
  { path: '/seo/:action/:id', name: 'seo.breadcrumb', element: SEO },
  { path: '/comments', name: 'comment.breadcrumb', element: Comment },
  { path: '/comments/:action/:id', name: 'comment.breadcrumb', element: Comment },
  { path: '/google/trend', name: 'google_trend.breadcrumb', element: GoogleTrend },
  { path: '/data/product', name: 'product.breadcrumb', element: DataProduct }
];

export default routes
