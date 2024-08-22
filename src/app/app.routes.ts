import { Routes } from '@angular/router';
import { CategoryListComponent } from './features/category/category-list/category-list.component';
import { AddCategoryComponent } from './features/category/add-category/add-category.component';
import { EditCategoryComponent } from './features/category/edit-category/edit-category.component';
import { BlogPostListComponent } from './features/blog-post/blog-post-list/blog-post-list.component';
import { AddBlogpostComponent } from './features/blog-post/add-blogpost/add-blogpost.component';
import { EditBlogPostComponent } from './features/blog-post/edit-blog-post/edit-blog-post.component';
import { HomeComponent } from './features/public/home/home.component';
import { BlogDetailsComponent } from './features/public/blog-details/blog-details.component';
import { LoginComponent } from './features/auth/login/login.component';
import { authGuard } from './features/auth/guards/auth.guard';

export const routes: Routes = [
    {
        path: "",
        component: HomeComponent
    },
    {
        path: "login",
        component: LoginComponent
    },
    {
        path: "admin/categories",
        component: CategoryListComponent,
        canActivate: [authGuard]
    },
    {
        path: "admin/categories/add",
        component: AddCategoryComponent,
        canActivate: [authGuard]
    },
    {
        path:"admin/categories/:id",
        component: EditCategoryComponent,
        canActivate: [authGuard]
    },
    {
        path: "admin/blogposts/add",
        component: AddBlogpostComponent,
        canActivate: [authGuard]
    },
    {
        path:"admin/blogposts/:id",
        component: EditBlogPostComponent,
        canActivate: [authGuard]
    },
    {
        path:"blogs/:url",
        component: BlogDetailsComponent
    },
    {
        path:"admin/blogposts",
        component: BlogPostListComponent,
        canActivate: [authGuard]
    },
];

