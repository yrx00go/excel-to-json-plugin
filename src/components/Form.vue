<script setup lang="ts">
import { bitable } from "@lark-base-open/js-sdk";
import { reactive, ref } from "vue";
import { useJSONData } from "../hooks/useData";
import type { FormInstance } from "element-plus";
import { downloadJsonAsJson } from "../utils/index";

const formRef = ref<FormInstance>();
const dynamicValidateForm = reactive<{
  keyColumn: number;
}>({
  keyColumn: 0,
});

const loading = ref(false);
const jsonData = reactive<any>({});

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      jsonData.value = await useJSONData(dynamicValidateForm);
      loading.value = false;
      console.log("submit!");
    } else {
      console.log("error submit!");
      return false;
    }
  });
};

const downloadJSON = () => {
  Object.entries(jsonData.value).forEach(([name, json]) => {
    downloadJsonAsJson(json, name);
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>

<template>
  <el-form
    ref="formRef"
    :model="dynamicValidateForm"
    label-width="120px"
    class="demo-dynamic"
    v-loading="loading"
  >
    <el-form-item
      prop="keyColumn"
      label="key 的行数"
      :rules="[
        {
          required: true,
          message: '输入key值的列号',
        },
        {
          type: 'number',
          message: 'Please input correct number',
        },
      ]"
    >
      <el-input v-model="dynamicValidateForm.keyColumn" type="text" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(formRef)"
        >生成JSON格式
      </el-button>
      <el-button v-if="jsonData" type="primary" @click="downloadJSON(formRef)"
        >下载
      </el-button>
    </el-form-item>
  </el-form>
  <div v-if="jsonData">
    <pre>{{ jsonData }}</pre>
  </div>
</template>

<style scoped>
.form :deep(.el-form-item__label) {
  font-size: 16px;
  color: var(--el-text-color-primary);
  margin-bottom: 0;
}
.form :deep(.el-form-item__content) {
  font-size: 16px;
}
</style>
