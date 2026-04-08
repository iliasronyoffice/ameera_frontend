"use client";
import {
  FaBars,
  FaTimes,
  FaChevronRight,
  FaChevronLeft,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import Link from "next/link";
import useCachedFetch from "@/app/utils/useCachedFetch";
import ButtonMenubar from "../icons/ButtonMenubar";

export default function AllCategoryModal() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("main");
  const [menuHistory, setMenuHistory] = useState(["main"]);
  const [expandedSections, setExpandedSections] = useState({});
  const [subCategories, setSubCategories] = useState({});
  const [loadingSubCategories, setLoadingSubCategories] = useState({});

  // Fetch main categories
  const {
    data: categories,
    loading,
    error,
  } = useCachedFetch(
    `${process.env.NEXT_PUBLIC_API_URL}/categories`,
    "all-categories",
    30 * 60 * 1000,
  );

  // Function to fetch subcategories
  const fetchSubCategories = async (categoryId) => {
    if (subCategories[categoryId]) return; // Already fetched

    setLoadingSubCategories((prev) => ({ ...prev, [categoryId]: true }));

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/sub-categories/${categoryId}`,
      );
      const data = await response.json();

      if (data.success && data.data) {
        setSubCategories((prev) => ({
          ...prev,
          [categoryId]: data.data,
        }));
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    } finally {
      setLoadingSubCategories((prev) => ({ ...prev, [categoryId]: false }));
    }
  };

  // Navigate to submenu and fetch subcategories
  const navigateToMenu = async (menuId) => {
    setActiveMenu(menuId);
    setMenuHistory((prev) => [...prev, menuId]);

    // Extract category ID from menuId (format: "cat_123")
    const categoryId = menuId.split("_")[1];
    if (categoryId) {
      await fetchSubCategories(categoryId);
    }
  };

  // Build main menu from categories
  const buildMainMenu = () => {
    if (!categories || categories.length === 0) {
      return {
        title: "Browse all categories",
        sections: [
          {
            title: "Shop by Department",
            items: [
              {
                name: loading
                  ? "Loading categories..."
                  : "No categories available",
                hasSubmenu: false,
              },
            ],
          },
        ],
      };
    }

    return {
      title: "Browse all categories",
      sections: [
        {
          title: "Shop by Department",
          items: categories.map((cat) => ({
            name: cat.name,
            hasSubmenu: cat.number_of_children > 0, // Show arrow only if has children
            menuId: `cat_${cat.id}`,
            id: cat.id,
            slug: cat.slug,
            icon: cat.icon,
            banner: cat.banner,
            link: `/shop_page?categories=${cat.id}`,
          })),
        },
        // {
        //   title: "Help & Settings",
        //   items: [
        //     { name: "Your Account", hasSubmenu: false, link: "/account" },
        //     { name: "Customer Service", hasSubmenu: false, link: "/help" },
        //     { name: "Sign in", hasSubmenu: false, link: "/login" },
        //   ],
        // },
      ],
    };
  };

  // Get current menu items
  const getCurrentMenuItems = () => {
    if (activeMenu === "main") {
      return buildMainMenu();
    }

    // For submenus, get from fetched subcategories
    const categoryId = activeMenu.split("_")[1];
    const subs = subCategories[categoryId] || [];
    const isLoading = loadingSubCategories[categoryId];

    return {
      title: categories?.find((c) => c.id == categoryId)?.name || "Category",
      banner: categories?.find((c) => c.id == categoryId)?.banner,
      items: isLoading
        ? [{ name: "Loading subcategories...", isPlaceholder: true }]
        : subs.length > 0
          ? [
              {
                name: `All ${categories?.find((c) => c.id == categoryId)?.name || "Items"}`,
                link: `/shop_page?categories=${categoryId}`,
              },
              ...subs.map((sub) => ({
                name: sub.name,
                link: `/shop_page?categories=${sub.id}`,
                hasSubmenu: sub.number_of_children > 0,
                menuId: `cat_${sub.id}`,
                id: sub.id,
              })),
            ]
          : [{ name: "No subcategories available", isPlaceholder: true }],
    };
  };

  const currentMenu = getCurrentMenuItems();

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const navigateBack = () => {
    if (menuHistory.length > 1) {
      const newHistory = [...menuHistory];
      newHistory.pop();
      setActiveMenu(newHistory[newHistory.length - 1]);
      setMenuHistory(newHistory);
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setActiveMenu("main");
    setMenuHistory(["main"]);
    setExpandedSections({});
    // Optionally clear subcategories to refresh on next open
    // setSubCategories({});
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isMenuOpen &&
        !e.target.closest("#menu-container") &&
        !e.target.closest("#menu-trigger")
      ) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  return (
    <div className="relative">
      {/* Menu Trigger Button */}
      <button
        id="menu-trigger"
        onClick={() => setIsMenuOpen(true)}
        className="flex items-center gap-1 hover:underline px-2 py-1"
      >
        {/* <FaBars className="text-sm lg:text-base cursor-pointer text-5xl" /> */}

        <ButtonMenubar
          color="currentColor"
          className="w-6 h-6 md:w-6 md:h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10 cursor-pointer"
        />
      </button>

      {/* Menu Container */}
      <div
        id="menu-container"
        className={`fixed top-0 left-0 h-full w-80 bg-white z-50 shadow-xl transform transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Menu Header */}
        <div className="bg-header-bottom text-white p-4 flex justify-between items-center">
          <h2 className="text-lg font-medium">{currentMenu.title}</h2>
          <button
            onClick={closeMenu}
            className="p-1 rounded-full hover:bg-gray-700 transition-colors"
            aria-label="Close menu"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Menu Content */}
        <div className="h-full overflow-y-auto pb-16">
          {/* Back Button for Submenus */}
          {activeMenu !== "main" && (
            <button
              onClick={navigateBack}
              className="w-full flex items-center gap-2 p-4 text-gray-700 hover:bg-gray-100 border-b border-gray-200"
            >
              <FaChevronLeft className="text-gray-500" />
              <span>Back to main menu</span>
            </button>
          )}

          {/* Main Menu Sections */}
          {activeMenu === "main" &&
            currentMenu.sections?.map((section, sectionIndex) => (
              <div key={sectionIndex} className="mb-2">
                {/* Section Title */}
                {section.title && (
                  <div className="px-4 py-2 text-gray-800 font-medium text-sm">
                    {section.title}
                  </div>
                )}

                {/* Section Items */}
                <ul>
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      {item.isToggle ? (
                        <button
                          onClick={item.action}
                          className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-100 text-sm"
                        >
                          <span>{item.name}</span>
                          {expandedSections[item.section] ? (
                            <FaChevronUp className="text-gray-500" />
                          ) : (
                            <FaChevronDown className="text-gray-500" />
                          )}
                        </button>
                      ) : (
                        <div className="flex items-center justify-between group hover:bg-gray-100">
                          {/* Category Name - Click to go to shop */}
                          <Link
                            href={item.link || "#"}
                            onClick={(e) => {
                              if (!item.link) e.preventDefault();
                              closeMenu();
                            }}
                            className={`flex-1 px-4 py-3 text-gray-700 text-sm ${
                              item.isPlaceholder
                                ? "text-gray-400 cursor-not-allowed"
                                : "hover:text-main"
                            }`}
                          >
                            {item.name}
                          </Link>

                          {/* Right Arrow - Only show if has submenu */}
                          {item.hasSubmenu && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                navigateToMenu(item.menuId);
                              }}
                              className="px-4 py-3 text-gray-500 hover:text-main transition-colors"
                              aria-label={`View ${item.name} subcategories`}
                            >
                              <FaChevronRight className="text-sm" />
                            </button>
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>

                {/* Section Separator */}
                {sectionIndex < currentMenu.sections.length - 1 && (
                  <div className="border-t border-gray-200 my-2"></div>
                )}
              </div>
            ))}

          {/* Submenu Items (for non-main menus) */}
          {activeMenu !== "main" && currentMenu.items && (
            <ul className="py-2">
              {currentMenu.items.map((item, index) => (
                <li key={index}>
                  {item.isPlaceholder ? (
                    <div className="px-4 py-3 text-gray-400 text-sm">
                      {item.name}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between group hover:bg-gray-100">
                      <Link
                        href={item.link || "#"}
                        onClick={(e) => {
                          if (!item.link) e.preventDefault();
                          closeMenu();
                        }}
                        className="flex-1 px-4 py-3 text-gray-700 text-sm hover:text-main"
                      >
                        {item.name}
                      </Link>

                      {/* Right Arrow for subcategories that have their own children */}
                      {item.hasSubmenu && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            navigateToMenu(item.menuId);
                          }}
                          className="px-4 py-3 text-gray-500 hover:text-main transition-colors"
                        >
                          <FaChevronRight className="text-sm" />
                        </button>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}

          {/* Category Banner if available */}
          {/* {currentMenu.banner && currentMenu.banner !== "https://dev2.nisamirrorfashionhouse.com/public/assets/img/placeholder.jpg" && (
            <div className="p-4 mt-4">
              <img 
                src={currentMenu.banner} 
                alt={currentMenu.title}
                className="w-full rounded-lg"
              />
            </div>
          )} */}
        </div>

        {/* Back to Top Button */}
        <button
          onClick={closeMenu}
          className="absolute bottom-0 left-0 w-full bg-gray-100 border-t border-gray-200 py-3 text-gray-700 text-sm hover:bg-gray-200"
        >
          close
        </button>
      </div>
    </div>
  );
}
