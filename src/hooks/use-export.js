import { ElMessage, ElMessageBox } from "element-plus";
import Cookie from "js-cookie";
import { SearchUnits, SearchStaffs } from "@/api/common.js";
//公司导出钩子
export function useCompanyExport() {
  // 导出表头配置
  const EXPORT_HEADERS = ["编码", "名称(中文)", "名称（日文）", "状态"];

  const FIELD_MAPPING = [
    "UnitCode",
    "UnitName",
    "UnitName_jp",
    "UnitStatusDesc",
  ];

  // 处理导出数据
  const processExportData = (data) => {
    return data.map((row) => ({
      ...row,
      UnitName_jp: row.Ext_I18n?.UnitName_jp || "",
      UnitStatusDesc: row.UnitStatus == 1 ? "正常" : "停用",
    }));
  };

  // 格式化JSON数据
  const formatJson = (filterVal, jsonData) => {
    return jsonData.map((v) => filterVal.map((j) => v[j]));
  };

  // 主导出函数
  const handleExport = async (query, tableLoading) => {
    const confirmed = await ElMessageBox.confirm("是否确认导出？", "提示", {
      type: "warning",
      cancelButtonClass: "button2",
      confirmButtonClass: "button1",
    }).catch(() => false);

    if (!confirmed) return;

    try {
      // 处理查询条件
      const searchCondition = { ...query };

      // 获取导出数据
      tableLoading.value = true;

      const res = await SearchUnits({
        PageStartRow: 0,
        PageRowCount: 100000,
        NoPage: true,
        SearchCondition: searchCondition,
      });

      tableLoading.value = false;

      if (res.Code !== 200) {
        throw new Error(res.Message);
      }

      if (!res.DataMap) {
        ElMessage.error("当前暂无数据");
        return;
      }

      // 处理数据并导出
      const exportData = processExportData(res.DataMap);
      await exportToExcel(exportData);
    } catch (error) {
      tableLoading.value = false;
      ElMessage.error(error.message || "导出失败");
    }
  };

  // 导出到Excel
  const exportToExcel = async (data) => {
    const excel = await import("@/vendor/Export2Excel");
    const formattedData = formatJson(FIELD_MAPPING, data);
    const timestamp = new Date().toISOString().slice(0, 10);

    excel.export_json_to_excel({
      header: EXPORT_HEADERS,
      data: formattedData,
      filename: `公司列表导出_${timestamp}`,
      autoWidth: true,
    });
  };

  return {
    handleExport,
  };
}
export function useDepartExport() {
  // 导出表头配置
  const EXPORT_HEADERS = [
    "编码",
    "名称(中文)",
    "名称（日文）",
    "所属公司",
    "状态",
  ];

  const FIELD_MAPPING = [
    "UnitCode",
    "UnitName",
    "UnitName_jp",
    "UnitNameDesc",
    "UnitStatusDesc",
  ];

  // 处理导出数据
  const processExportData = (data) => {
    return data.map((row) => ({
      ...row,
      UnitName_jp: row.Ext_I18n?.UnitName_jp || "",
      UnitNameDesc: row.Ext_ParentUnit?.UnitName || "",
      UnitStatusDesc: row.UnitStatus == 1 ? "正常" : "停用",
    }));
  };

  // 格式化JSON数据
  const formatJson = (filterVal, jsonData) => {
    return jsonData.map((v) => filterVal.map((j) => v[j]));
  };

  // 主导出函数
  const handleExport = async (query, tableLoading) => {
    const confirmed = await ElMessageBox.confirm("是否确认导出？", "提示", {
      type: "warning",
      cancelButtonClass: "button2",
      confirmButtonClass: "button1",
    }).catch(() => false);

    if (!confirmed) return;

    try {
      // 处理查询条件
      const searchCondition = { ...query };

      // 获取导出数据
      tableLoading.value = true;

      const res = await SearchUnits({
        PageStartRow: 0,
        PageRowCount: 100000,
        NoPage: true,
        SearchCondition: searchCondition,
      });

      tableLoading.value = false;

      if (res.Code !== 200) {
        throw new Error(res.Message);
      }

      if (!res.DataMap) {
        ElMessage.error("当前暂无数据");
        return;
      }

      // 处理数据并导出
      const exportData = processExportData(res.DataMap);
      await exportToExcel(exportData);
    } catch (error) {
      tableLoading.value = false;
      ElMessage.error(error.message || "导出失败");
    }
  };

  // 导出到Excel
  const exportToExcel = async (data) => {
    const excel = await import("@/vendor/Export2Excel");
    const formattedData = formatJson(FIELD_MAPPING, data);
    const timestamp = new Date().toISOString().slice(0, 10);

    excel.export_json_to_excel({
      header: EXPORT_HEADERS,
      data: formattedData,
      filename: `部门列表导出_${timestamp}`,
      autoWidth: true,
    });
  };

  return {
    handleExport,
  };
}
export function useStaffsExport() {
  // 导出表头配置
  const EXPORT_HEADERS = [
    "工号",
    "姓名",
    "性别",
    "手机",
    "邮箱",
    "所属公司",
    "所属部门",
    "是否绑定",
    "状态",
  ];

  const FIELD_MAPPING = [
    "StaffNo",
    "StaffName",
    "StaffGenderDesc",
    "StaffMobile",
    "StaffEmail",
    "companyDesc",
    "departDesc",
    "Ext_BindWxxcxDesc",
    "statusDesc",
  ];

  // 处理导出数据
  const processExportData = (data) => {
    return data.map((row) => ({
      ...row,
      StaffGenderDesc: row.StaffGender == 1 ? "男" : "女",
      companyDesc: row.Ext_Unit.Ext_ParentUnit.UnitName, //公司
      departDesc: row.Ext_Unit.UnitName, //部门
      statusDesc: row.StaffStatus == 1 ? "正常" : "停用",
    }));
  };

  // 格式化JSON数据
  const formatJson = (filterVal, jsonData) => {
    return jsonData.map((v) => filterVal.map((j) => v[j]));
  };

  // 主导出函数
  const handleExport = async (query, tableLoading) => {
    const confirmed = await ElMessageBox.confirm("是否确认导出？", "提示", {
      type: "warning",
      cancelButtonClass: "button2",
      confirmButtonClass: "button1",
    }).catch(() => false);

    if (!confirmed) return;

    try {
      // 处理查询条件
      const searchCondition = { ...query };

      // 获取导出数据
      tableLoading.value = true;

      const res = await SearchStaffs({
        PageStartRow: 0,
        PageRowCount: 100000,
        NoPage: true,
        SearchCondition: searchCondition,
      });

      tableLoading.value = false;

      if (res.Code !== 200) {
        throw new Error(res.Message);
      }

      if (!res.DataMap) {
        ElMessage.error("当前暂无数据");
        return;
      }

      // 处理数据并导出
      const exportData = processExportData(res.DataMap);
      await exportToExcel(exportData);
    } catch (error) {
      tableLoading.value = false;
      ElMessage.error(error.message || "导出失败");
    }
  };

  // 导出到Excel
  const exportToExcel = async (data) => {
    const excel = await import("@/vendor/Export2Excel");
    const formattedData = formatJson(FIELD_MAPPING, data);
    const timestamp = new Date().toISOString().slice(0, 10);

    excel.export_json_to_excel({
      header: EXPORT_HEADERS,
      data: formattedData,
      filename: `员工列表导出_${timestamp}`,
      autoWidth: true,
    });
  };

  return {
    handleExport,
  };
}
