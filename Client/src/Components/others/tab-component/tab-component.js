import React from "react";
import { Tabs } from "@mantine/core";

const tabLineStyle = {
  margin: "0 4px",
  borderBottom: "1px solid lightgrey",
};

function TabsComponent({
  tabsData,
  disabledTabs,
  activeTab,
  setActiveTab,
  activeColor,
  inactiveColor,
  blueTabs,
}) {
  return (
    <Tabs
      color={blueTabs ? "indigo" : "green"}
      variant="pills"
      radius="sm"
      defaultValue={tabsData[0].value}
      value={activeTab}
      onTabChange={setActiveTab}
    >
      <Tabs.List style={tabLineStyle}>
        {tabsData.map((tab) => (
          <Tabs.Tab
            key={tab.value}
            value={tab.value}
            icon={tab.icon}
            disabled={disabledTabs ? disabledTabs.includes(tab.value) : null}
            // style={disabledTabs ? (disabledTabs.includes(tab.value) ? disabledTabStyles : null) : null}
            style={{
              // backgroundColor: activeTab === tab.value ? "#3777c4" : "#b3d5ff",
              backgroundColor: activeTab === tab.value ? "#2d991f" : "#fafafc",
              cursor:
                disabledTabs && disabledTabs.includes(tab.value)
                  ? "not-allowed"
                  : "pointer",
              fontFamily: "Poppins",
            }}
          >
            {tab.label}
          </Tabs.Tab>
        ))}
      </Tabs.List>

      {tabsData.map((tab) => (
        <Tabs.Panel key={tab.value} value={tab.value} pt="xs">
          {tab.component}
        </Tabs.Panel>
      ))}
    </Tabs>
  );
}

export default TabsComponent;
