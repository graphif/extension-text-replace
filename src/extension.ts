await prg.keybinds_register(
  "text-replace",
  { $lucide: "Search" },
  "r p l c",
  Comlink.proxy(async () => {
    const project = await prg.tabs_getCurrentProject();
    if (!project) {
      await prg.toast_error("没有打开的项目");
      return;
    }

    // 第一步：输入要查找的文本片段
    const searchText = await prg.dialog_input(
      "文本替换 — 第 1 步",
      "请输入要查找的文本片段（区分大小写）",
      { placeholder: "例如：旧文本" },
    );
    if (searchText === undefined || searchText === "") {
      await prg.toast_warning("已取消：未输入查找内容");
      return;
    }

    // 第二步：输入替换目标文本
    const replaceText = await prg.dialog_input(
      "文本替换 — 第 2 步",
      `将把所有「${searchText}」替换为：`,
      { placeholder: "例如：新文本（留空则删除该片段）" },
    );
    if (replaceText === undefined) {
      await prg.toast_warning("已取消");
      return;
    }

    const sm = await project.stageManager;
    const [textNodes, sections] = await Promise.all([
      sm.getTextNodes(),
      sm.getSections(),
    ]);

    // 统计受影响的节点数
    let affectedCount = 0;

    // 处理文本节点
    for (const node of textNodes) {
      const text = await node.text;
      if (text.includes(searchText)) {
        await node.rename(text.replaceAll(searchText, replaceText));
        affectedCount++;
      }
    }

    // 处理分组框（Section）标题
    for (const section of sections) {
      const text = await section.text;
      if (text.includes(searchText)) {
        await section.rename(text.replaceAll(searchText, replaceText));
        affectedCount++;
      }
    }

    if (affectedCount === 0) {
      await prg.toast_warning(`未找到包含「${searchText}」的节点`);
    } else {
      await prg.toast_success(
        `替换完成：共修改了 ${affectedCount} 个节点/分组框`,
      );
    }
  }),
);

export {};