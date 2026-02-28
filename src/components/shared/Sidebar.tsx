"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Logo from "/public/logo.png";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Tag,
  CreditCard,
  Shield,
  X,
  Store,
  Package,
  Hash,
  Palette,
  Calculator,
  Truck,
  HelpCircle,
  FileText,
  User,
  Percent,
  Settings,
  ChevronDown,
  Star,
  Award,
  UserPlus,
} from "lucide-react";
import { MdPayment } from "react-icons/md";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type Role = "admin" | "vendor" | "user";

interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  role?: Role;
  isCollapsed: boolean;
}

export function AppSidebar({
  isOpen,
  onClose,
  role = "admin",
  isCollapsed,
}: AppSidebarProps) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  // State for collapsible sections
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    shops: false,
    products: false,
    wallet: false,
    faqs: false,
    terms: false,
    coupons: false,
    settings: false,
    vendors: false,
    staff: false,
    reviewItems: false,
  });

  // Icon configuration
  const iconConfig = {
    size: 18,
    className: "flex-shrink-0",
    active: "text-blue-700",
    inactive: "text-gray-600",
  };

  // Memoize navigation items to prevent unnecessary re-renders
  const navigationItems = useMemo(
    () => ({
      // shopManagement: [
      //   { icon: Store, label: "All Shop", href: "/admin/all-shop" },
      //   { icon: Store, label: "Add New Shop", href: "/admin/create-shop" },
      //   {
      //     icon: Store,
      //     label: "InActive Shops",
      //     href: "/admin/in-active-new-shops",
      //   },
      // ],
      productManagement: [
        { icon: Package, label: "All Products", href: "/AddNewProduct" },
        { icon: Tag, label: "Brands", href: "/brand-management" },
        { icon: Hash, label: "Categories", href: "/category-management" },
        // {
        //   icon: Folders,
        //   label: "Parent Categories",
        //   href: "/parent-categories",
        // },
        { icon: Tag, label: "Tags", href: "/tag-management" },
        { icon: Palette, label: "Brands", href: "/product-attributes" },
      ],
      authorManagement: [
        { icon: UserPlus, label: "Add Author", href: "/admin/add-author" },
        { icon: Users, label: "All Authors", href: "/admin/all-authors" },
      ],

      walletItems: [
        {
          icon: Calculator,
          label: "Approved Deposits",
          href: "/admin/approved-deposits",
        },
        {
          icon: Truck,
          label: "Reject Deposits",
          href: "/admin/reject-deposits",
        },
        {
          icon: CreditCard,
          label: "Refund Requests",
          href: "/admin/refund-requests",
        },
      ],
      faqItems: [
        { icon: HelpCircle, label: "All FAQs", href: "/admin/faqs" },
        { icon: FileText, label: "Add New FAQ", href: "/admin/terms" },
      ],
      termsItems: [
        { icon: HelpCircle, label: "All Terms", href: "/admin/faqs" },
        { icon: FileText, label: "Add New Terms", href: "/admin/terms" },
      ],
      // couponsItems: [
      //   { icon: Percent, label: "All Coupons", href: "/admin/coupons" },
      //   {
      //     icon: Plus,
      //     label: "Add Coupon",
      //     href: "/admin/coupons/add-new-coupons",
      //   },
      // ],
      settingsItems: [
        {
          icon: Settings,
          label: "General Settings",
          href: "/admin/settings/general",
        },
        {
          icon: Palette,
          label: "Appearance",
          href: "/admin/settings/appearance",
        },
        {
          icon: Percent,
          label: "Coupons",
          href: "/admin/settings/coupons",
        },
        {
          icon: MdPayment,
          label: "Payment Methods Settings",
          href: "/admin/settings/payment-methods",
        },
        {
          icon: FileText,
          label: "Dynamic Pages",
          href: "/admin/settings/dynamic-pages",
        },
        {
          icon: Settings,
          label: "Footer Settings",
          href: "/admin/settings/footer-settings",
        },
      ],
      // vendorItems: [
      //   { icon: Store, label: "Vendors", href: "/admin/all-vendors" },
      //   { icon: User, label: "Customers", href: "/admin/customers" },
      // ],
      staffItems: [
        { icon: Store, label: "Vendors", href: "/admin/vendors" },
        { icon: User, label: "Customers", href: "/admin/customers" },
      ],
      courierManagement: [
        // { icon: Calculator, label: "Taxes", href: "/admin/taxes" },
        { icon: Truck, label: "Courier", href: "/admin/courier" },
        // { icon: CreditCard, label: "Withdrawals", href: "/admin/withdrawals" },
      ],

      orderManagement: [
        { icon: ShoppingCart, label: "Orders", href: "/admin/order" },
        // { icon: Plus, label: "Create Order", href: "/admin/create-order" },
        // {
        //   icon: ArrowRightLeft,
        //   label: "Transactions",
        //   href: "/admin/transaction",
        // },
      ],

      reviewItems: [
        { icon: Star, label: "All Reviews", href: "/admin/reviews" },
      ],
    }),
    []
  );

  // Initialize open sections based on active children
  useEffect(() => {
    const newOpenSections = { ...openSections };

    (
      Object.keys(navigationItems) as Array<keyof typeof navigationItems>
    ).forEach((key) => {
      const items = navigationItems[key];
      newOpenSections[key] = items.some((item) => isActive(item.href));
    });

    setOpenSections(newOpenSections);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const renderLink = (
    href: string,
    Icon: React.ComponentType<{ className?: string; size?: number }>,
    label: string
  ) => (
    <Link
      href={href}
      key={`link-${href}`}
      onClick={() => window.innerWidth < 768 && onClose()}
      className={cn(
        "flex items-center gap-3 rounded-md text-sm transition-all duration-200 ease-in-out",
        "px-3 py-2.5",
        isActive(href)
          ? "bg-blue-50 text-blue-700 font-medium"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
        isCollapsed ? "justify-center px-2" : "pl-4",
        "transform hover:translate-x-1 transition-transform"
      )}
    >
      <Icon
        size={iconConfig.size}
        className={cn(
          iconConfig.className,
          isActive(href) ? iconConfig.active : iconConfig.inactive,
          "transition-colors duration-200"
        )}
      />
      {!isCollapsed && (
        <span className="truncate transition-opacity duration-200">
          {label}
        </span>
      )}
    </Link>
  );

  const renderCollapsible = (
    Icon: React.ComponentType<{ className?: string; size?: number }>,
    label: string,
    items: {
      icon: React.ComponentType<{ className?: string; size?: number }>;
      label: string;
      href: string;
    }[],
    sectionKey: string
  ) => {
    const isAnyChildActive = items.some((item) => isActive(item.href));
    const isOpen = openSections[sectionKey] || isAnyChildActive;

    return (
      <Collapsible
        key={`collapsible-${sectionKey}`}
        open={isOpen}
        onOpenChange={() => toggleSection(sectionKey)}
        className="transition-all duration-200 ease-in-out"
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-between rounded-md p-0 h-auto font-normal transition-all duration-200 ease-in-out",
              "hover:bg-gray-50 px-3 py-2.5",
              isCollapsed ? "justify-center px-2" : "pl-4",
              isAnyChildActive
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:text-gray-900",
              "group"
            )}
            onClick={(e) => {
              if (isCollapsed) {
                e.preventDefault();
                toggleSection(sectionKey);
              }
            }}
          >
            <div className="flex items-center gap-3">
              <Icon
                size={iconConfig.size}
                className={cn(
                  iconConfig.className,
                  isAnyChildActive ? iconConfig.active : iconConfig.inactive,
                  "group-hover:text-blue-600 transition-colors duration-200"
                )}
              />
              {!isCollapsed && (
                <span className="truncate transition-opacity duration-200">
                  {label}
                </span>
              )}
            </div>
            {!isCollapsed && (
              <ChevronDown
                size={16}
                className={cn(
                  "transition-all duration-200",
                  isOpen ? "rotate-180" : "",
                  isAnyChildActive ? "text-blue-700" : "text-gray-500",
                  "group-hover:text-blue-600"
                )}
              />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            isCollapsed ? "ml-0" : "ml-2 pl-6 border-l border-gray-200",
            "data-[state=open]:animate-collapsible-down",
            "data-[state=closed]:animate-collapsible-up"
          )}
        >
          <div className="space-y-1 mt-1">
            {items.map((item) => (
              <Link
                key={`${sectionKey}-${item.href}`}
                href={item.href}
                onClick={() => window.innerWidth < 768 && onClose()}
                className={cn(
                  "flex items-center gap-3 rounded-md text-sm font-normal transition-all duration-200 ease-in-out",
                  "px-3 py-2 hover:bg-gray-50 w-full",
                  isActive(item.href)
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-600 hover:text-gray-900",
                  isCollapsed ? "justify-center px-2" : "",
                  "transform hover:translate-x-1"
                )}
              >
                <item.icon
                  size={iconConfig.size}
                  className={cn(
                    iconConfig.className,
                    isActive(item.href)
                      ? iconConfig.active
                      : iconConfig.inactive,
                    "transition-colors duration-200"
                  )}
                />
                {!isCollapsed && (
                  <span className="truncate transition-opacity duration-200">
                    {item.label}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  };

  const renderSection = (
    title: string,
    items: {
      icon: React.ComponentType<{ className?: string; size?: number }>;
      label: string;
      href: string;
    }[]
  ) => (
    <div key={`section-${title}`} className="space-y-1">
      {!isCollapsed && (
        <h3 className="px-4 py-2 text-left uppercase text-xs font-semibold text-gray-400 tracking-wider transition-opacity duration-200">
          {title}
        </h3>
      )}
      <div className="space-y-1">
        {items.map((item) => renderLink(item.href, item.icon, item.label))}
      </div>
    </div>
  );

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-50 h-screen bg-white text-black ",
        "flex flex-col transition-all duration-300 ease-in-out",
        "transform",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "md:translate-x-0 md:static",
        isCollapsed ? "w-11 md:w-16" : "w-64",
        "overflow-hidden"
      )}
    >
      {/* Logo Section */}
      <div
        className={cn(
          "flex items-center gap-3 p-4 bg-white h-16 transition-all duration-300",
          isCollapsed ? "justify-center px-2" : "px-5",
          "shrink-0"
        )}
      >
        {!isCollapsed && (
          <h1 className="text-lg font-bold text-black truncate transition-opacity duration-200">
            <Image
              src={Logo}
              alt="logo"
              height={60}
              width={60}
            />
          </h1>
        )}
      </div>

      {/* Mobile Close Button */}
      {!isCollapsed && (
        <div className="flex items-center justify-between p-4 md:hidden border-b">
          <h2 className="text-lg font-bold text-black">Menu</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors duration-200 hover:rotate-90"
          >
            <X className="h-6 w-6 text-gray-400 transition-transform duration-300" />
          </button>
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 p-2 overflow-y-auto space-y-4 transition-all duration-300 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {role === "admin" && (
          <>
            {/* MAIN SECTION */}
            <div key="main-section">
              {!isCollapsed && (
                <h3 className="px-4 py-2 text-left uppercase text-xs font-semibold text-gray-400 tracking-wider transition-opacity duration-200">
                  MAIN
                </h3>
              )}
              {renderLink("/", LayoutDashboard, "Dashboard")}
            </div>

            {/* SHOP MANAGEMENT */}
            {/* <div key="shop-management" className="space-y-2 text-center">
              {!isCollapsed && (
                <h3 className="px-4 py-2 text-left uppercase text-xs font-semibold text-gray-400 tracking-wider transition-opacity duration-200">
                  SHOP MANAGEMENT
                </h3>
              )}
              <div className="md:ml-1">
                {renderCollapsible(
                  Store,
                  "Shops",
                  navigationItems.shopManagement,
                  "shopManagement"
                )}
              </div>
              {renderLink("/admin/my-shops", ShoppingBag, "My Shops")}
              {renderLink(
                "/admin/shop-transfer-request",
                ArrowRightLeft,
                "Shop Transfer Request"
              )}
            </div> */}

            {/* PRODUCT MANAGEMENT */}
            <div key="product-management" className="space-y-2 ">
              {!isCollapsed && (
                <h3 className="px-4 py-2 text-left uppercase text-xs font-semibold text-gray-400 tracking-wider transition-opacity duration-200">
                  PRODUCT MANAGEMENT
                </h3>
              )}

              <div className="ml-1">
                {/* Collapsible Group: Products */}
                <div className="ml-1">
                  {renderCollapsible(
                    Package,
                    "Products",
                    [
                      {
                        icon: Package,
                        label: "All Products",
                        href: "/admin/all-product",
                      },
                      {
                        icon: Package,
                        label: "Add New Product",
                        href: "/admin/add-new-product",
                      },
                      {
                        icon: Package,
                        label: "Draft Products",
                        href: "/admin/draft-products",
                      },
                    ],
                    "productManagement"
                  )}
                </div>

                {/* Outside the group */}

                {/* {renderLink(
                  "/admin/parent-categories",
                  Folders,
                  "Parent Categories"
                )} */}
                {renderLink("/admin/category-management", Hash, "Categories")}
                {renderLink("/admin/tag-management", Tag, "Tags")}
                {/* {renderLink("/admin/product-attributes", Palette, "Attributes")}
                {renderLink("/admin/product-attributes", Award, "Attributes")} */}
                {renderLink("/admin/brand-management", Award, "Brands")}

                {/* Optional: more links */}
                {/* {renderLink(
                  "/admin/inventory-management",
                  BarChart3,
                  "Inventory"
                )} */}
                {/* <div className="ml-2">
                  {renderCollapsible(
                    CreditCard,
                    "Wallet",
                    navigationItems.walletItems,
                    "walletItems"
                  )}
                </div> */}
              </div>
            </div>
            {/* ORDER MANAGEMENT */}
            <div className="ml-1">
              {renderSection(
                "ORDER MANAGEMENT",
                navigationItems.orderManagement
              )}
            </div>
            {/* E-COMMERCE MANAGEMENT */}
            <div>
              <div className="ml-1">
                {renderSection(
                  "COURIER MANAGEMENT",
                  navigationItems.courierManagement
                )}
              </div>

              {/* WALLET */}
              {/* <div key="wallet-section" className="space-y-2 ">
                {!isCollapsed && (
                  <h3 className="px-4 py-2 text-left uppercase text-xs font-semibold text-gray-400 tracking-wider transition-opacity duration-200">
                    WALLET
                  </h3>
                )}
                <div className="ml-2">
                  {renderCollapsible(
                    CreditCard,
                    "Wallet",
                    navigationItems.walletItems,
                    "walletItems"
                  )}
                </div>
              </div> */}
            </div>
            <div className="ml-1">
              {renderSection(
                "AUTHOR MANAGEMENT",
                navigationItems.authorManagement
              )}
            </div>

            {/* REVIEW MANAGEMENT */}
            <div key="review-management-section" className="space-y-2 ">
              {!isCollapsed && (
                <h3 className="px-4 py-2 text-left uppercase text-xs font-semibold text-gray-400 tracking-wider transition-opacity duration-200">
                  REVIEW MANAGEMENT
                </h3>
              )}
              <div className="ml-2">
                {renderCollapsible(
                  Star,
                  "Reviews",
                  navigationItems.reviewItems,
                  "reviewItems"
                )}
              </div>
            </div>

            {/* Layout/Page control */}
            {/* <div key="layout-section" className="space-y-2">
              {!isCollapsed && (
                <h3 className="px-4 py-2 text-left uppercase text-xs font-semibold text-gray-400 tracking-wider transition-opacity duration-200">
                  LAYOUT/PAGE
                </h3>
              )}
              <div className="ml-2">
                {renderCollapsible(
                  HelpCircle,
                  "FAQs",
                  navigationItems.faqItems,
                  "faqItems"
                )}
                {renderCollapsible(
                  FileText,
                  "Terms",
                  navigationItems.termsItems,
                  "termsItems"
                )}
                <div className="-ml-1">
                  {renderLink(
                    "/admin/become-seller",
                    UserPlus,
                    "Become a Seller"
                  )}
                </div>
              </div>
            </div> */}

            {/* USER CONTROL */}
            <div key="user-control-section" className="space-y-2 ">
              {!isCollapsed && (
                <h3 className="px-4 py-2 text-left uppercase text-xs font-semibold text-gray-400 tracking-wider transition-opacity duration-200">
                  USER CONTROL
                </h3>
              )}
              <div className="ml-1">
                <div>
                  {renderLink("/admin/all-users", Users, "All users")}
                  {renderLink("/admin/admin-list", Shield, "Admin list")}
                </div>
                {/* <div className="ml-[6px]">
                  {renderCollapsible(
                    Store,
                    "Vendors",
                    navigationItems.vendorItems,
                    "vendorItems"
                  )}
             
                </div> */}
              </div>
            </div>

            {/* COUPONS */}
            {/* <div key="coupons-section" className="space-y-2">
              {!isCollapsed && (
                <h3 className="px-4 py-2 text-left uppercase text-xs font-semibold text-gray-400 tracking-wider transition-opacity duration-200">
                  COUPONS
                </h3>
              )}
              <div className="ml-[12px]">
                {renderCollapsible(
                  Percent,
                  "Coupons",
                  navigationItems.couponsItems,
                  "couponsItems"
                )}
              </div>
            </div> */}

            {/* SETTINGS */}
            <div key="settings-section" className="space-y-2">
              {!isCollapsed && (
                <h3 className="px-4 py-2 text-left uppercase text-xs font-semibold text-gray-400 tracking-wider transition-opacity duration-200">
                  SETTINGS
                </h3>
              )}
              <div className="ml-[12px]">
                {renderCollapsible(
                  Settings,
                  "Settings",
                  navigationItems.settingsItems,
                  "settingsItems"
                )}
              </div>
            </div>
          </>
        )}
      </nav>
    </aside>
  );
}
