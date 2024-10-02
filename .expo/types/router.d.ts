/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(drawer)` | `/(drawer)/AboutUsPage` | `/(drawer)/CheckOutPage` | `/(drawer)/ContactUsPage` | `/(drawer)/LandingPage` | `/(drawer)/MyCartPage` | `/(drawer)/OrderHistoryPage` | `/(drawer)/ProductsPage` | `/(drawer)/ProfilePage` | `/AboutUsPage` | `/Authentication` | `/Authentication/ForgotPasswordPage` | `/Authentication/LoginPage` | `/Authentication/SignUpPage` | `/Authentication/VerificationPage` | `/CheckOutPage` | `/ContactUsPage` | `/LandingPage` | `/MyCartPage` | `/OrderHistoryPage` | `/ProductsPage` | `/ProfilePage` | `/_sitemap` | `/context/CartContext` | `/context/CategoriesContext` | `/context/ItemsContext` | `/context/UserContext`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
