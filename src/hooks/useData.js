import { bitable } from '@lark-base-open/js-sdk';


async function useJSONData(formData) {
    const result = {}

    // 读取当前所选的tableId、baseId、viewId
    const selection = await bitable.base.getSelection();
    const table = await bitable.base.getTableById(selection?.tableId);

    // 获取一table
    const view = await table.getViewById(selection.viewId);

    // 使用视图实例的API: getFieldMetaList ，获取数据表所有字段信息
    const metaList = await view.getFieldMetaList();
    const keyField = await table.getFieldByName(metaList[formData.keyColumn]?.name || '');

    const records = await table.getRecordIdList(); // 获取所有记录id列表

    const fieldList = {};

    // 使用 Promise.all 来并行获取字段信息
    await Promise.all(metaList.map(async (meta, index) => {
        if (index === formData.keyColumn) {
            fieldList[meta.name] = keyField;
        } else {
            const field = await table.getFieldByName(meta.name);
            fieldList[meta.name] = field;
        }

        result[meta.name] = {};
    }));

    await Promise.all(records.map(async (recordId) => {
        const keyName = await keyField.getCellString(recordId);
        if (keyName === '') return;
        await Promise.all(Object.entries(fieldList).map(async ([fieldName, field]) => {
            const fieldValue = await field.getCellString(recordId);
            result[fieldName][keyName] = fieldValue;
        }));
    }));

    return result;
}


export { useJSONData }