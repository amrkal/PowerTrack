/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(drawer)` | `/(drawer)/AboutUsPage` | `/(drawer)/CheckOutPage` | `/(drawer)/ContactUsPage` | `/(drawer)/MyCartPage` | `/(drawer)/OrderHistoryPage` | `/(drawer)/Orders` | `/(drawer)/Orders/OrderHistoryPage` | `/(drawer)/ProductsPage` | `/(drawer)/ProfilePage` | `/(drawer)\CheckOutPage` | `/(drawer)\ProfilePage` | `/AboutUsPage` | `/Authentication` | `/Authentication/ForgotPasswordPage` | `/Authentication/LoginPage` | `/Authentication/SignUpPage` | `/Authentication/VerificationPage` | `/Authentication\LoginPage` | `/Authentication\SignUpPage` | `/CheckDelivery` | `/CheckDelivery/PaymentPage` | `/CheckDelivery\DeliveryPage` | `/CheckOutPage` | `/ContactUsPage` | `/MyCartPage` | `/OrderHistoryPage` | `/Orders` | `/Orders/OrderHistoryPage` | `/ProductsPage` | `/ProfilePage` | `/_sitemap` | `/context/CartContext` | `/context/UserContext`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
