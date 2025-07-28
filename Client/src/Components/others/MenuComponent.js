import {
  FiHome,
  FiMail,
  FiPackage,
  FiPaperclip,
  FiSettings,
} from "react-icons/fi";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { RightOutlined } from "@ant-design/icons";
import { LeftOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Main menu section
const MenuComponent = ({ menu }) => {
  const navigate = useNavigate();
  const [selectedKey, setSelectedKey] = useState("");

  const customIconStyle = {
    fontSize: "16px", // Adjust the size of the icon
  };

  const CustomExpandIcon = ({ isSelected }) => {
    return isSelected ? (
      <LeftOutlined
        className="text-white"
        style={{ height: "5px", width: "5px", color: "white" }}
      />
    ) : (
      <LeftOutlined />
    );
  };

  const menuItemTitleStyle = {
    color: "blue",
    borderBottom: "1px solid black",
    paddingBottom: "2px",
  };

  const menuItemStyle = {
    backgroundColor: "#15aabf",
    color: "black",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.4)",
    transition: "none !important",
  };

  function renderMenuItems(menuItems) {
    return menuItems.length > 0
      ? menuItems.map((menuItem) => {
          if (menuItem.children && menuItem.children.length > 0) {
            // Render submenu
            return (
              <Menu.SubMenu
                key={menuItem.key}
                title={menuItem.label}
                icon={menuItem.icon}
              >
                {renderMenuItems(menuItem.children)}
              </Menu.SubMenu>
            );
          } else {
            // Render menu item
            return (
              <Menu.Item
                key={menuItem.key}
                icon={menuItem.icon}
                style={menuItem.key === selectedKey ? menuItemStyle : {}}
              >
                <span style={menuItemTitleStyle}>{menuItem.label}</span>
              </Menu.Item>
            );
          }
        })
      : null;
  }

  return (
    <div>
      <style>
        {`
          .ant-menu-item-selected:not(.ant-menu-item-selected-active) {
            background-color: #15aabf !important;
            color: black !important;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4) !important;
            transition: none !important;
          }
        `}
      </style>
      <Menu
        mode="inline"
        onClick={(item) => {
          setSelectedKey(item.key);
          navigate(item.key);
        }}
        style={{ color: "white", lineHeight: "2.5" }}
        selectedKeys={[selectedKey]}
        className="menComp bg-sky-700 hover:text-black"
      >
        {renderMenuItems(menu)}
      </Menu>
    </div>
  );
};

export default MenuComponent;
