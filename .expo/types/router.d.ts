/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(drawer)` | `/(drawer)/AboutUsPage` | `/(drawer)/ContactUsPage` | `/(drawer)/MyCartPage` | `/(drawer)/ProductsPage` | `/(drawer)/ProfilePage` | `/AboutUsPage` | `/Authentication` | `/Authentication/ForgotPasswordPage` | `/Authentication/LoginPage` | `/Authentication/LoginScreen` | `/Authentication/Register` | `/Authentication/SignUpPage` | `/Authentication/VerificationPage` | `/CheckDelivery` | `/CheckDelivery/CheckOutPage` | `/CheckDelivery/DeliveryPage` | `/ContactUsPage` | `/MyCartPage` | `/ProductsPage` | `/ProfilePage` | `/_sitemap` | `/context/CartContext`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
