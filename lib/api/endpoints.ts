export const API_ENDPOINTS = {
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    me: '/auth/me',
  },
  articles: {
    list: '/articles',
    drafts: '/articles/me/drafts',
    bySlug: (slug: string) => `/articles/slug/${slug}`,
    byId: (id: string) => `/articles/${id}`,
    publish: (id: string) => `/articles/${id}/publish`,
    view: (id: string) => `/articles/${id}/view`,
  },
  users: {
    byUsername: (username: string) => `/users/${username}`,
    articles: (id: string) => `/users/${id}/articles`,
    follow: (id: string) => `/users/${id}/follow`,
    followers: (id: string) => `/users/${id}/followers`,
    followings: (id: string) => `/users/${id}/followings`,
    notifications: '/users/me/notifications',
    markNotificationsRead: '/users/me/notifications/read',
    profile: '/users/me/profile',
  },
  interactions: {
    like: (articleId: string) => `/interactions/${articleId}/like`,
    save: (articleId: string) => `/interactions/${articleId}/save`,
    comments: (articleId: string) => `/interactions/${articleId}/comments`,
  },
  notifications: {
    list: '/notifications',
    read: (id: string) => `/notifications/${id}/read`,
  },
  search: {
    articles: '/search/articles',
    users: '/search/users',
  },
  tags: {
    list: '/tags',
    bySlug: (slug: string) => `/tags/${slug}`,
  },
  media: {
    upload: '/media/upload',
  },
  admin: {
    users: '/admin/users',
    userStatus: (id: string) => `/admin/users/${id}/status`,
    moderateArticle: (id: string) => `/admin/articles/${id}/moderate`,
  },
} as const;
