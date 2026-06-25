await prg.keybinds_register(
  "complexity-analysis",
  { $lucide: "LayoutDashboard" },
  "c m p l x",
  Comlink.proxy(async () => {
    const project = await prg.tabs_getCurrentProject();
    if (!project) {
      await prg.toast_error("没有打开的项目");
      return;
    }
    const sm = await project.stageManager;

    const [
      textNodes,
      edges,
      imageNodes,
      svgNodes,
      penStrokes,
      urlNodes,
      latexNodes,
      sections,
      associations,
      connectPoints,
      lineEdges,
      crEdges,
    ] = await Promise.all([
      sm.getTextNodes(),
      sm.getEdges(),
      sm.getImageNodes(),
      sm.getSvgNodes(),
      sm.getPenStrokes(),
      sm.getUrlNodes(),
      sm.getLatexNodes(),
      sm.getSections(),
      sm.getAssociations(),
      sm.getConnectPoints(),
      sm.getLineEdges(),
      sm.getCrEdges(),
    ]);

    const [nodeChars, edgeChars] = await Promise.all([
      Promise.all(textNodes.map((n) => n.text)).then((texts) =>
        texts.reduce((sum, t) => sum + t.length, 0),
      ),
      Promise.all(edges.map((e) => e.text)).then((texts) =>
        texts.reduce((sum, t) => sum + t.length, 0),
      ),
    ]);

    const totalNodes =
      textNodes.length +
      imageNodes.length +
      svgNodes.length +
      urlNodes.length +
      latexNodes.length;

    const stats = [
      `📊 舞台复杂度分析`,
      ``,
      `节点类：`,
      `  文本节点: ${textNodes.length}`,
      `  图片节点: ${imageNodes.length}`,
      `  SVG节点: ${svgNodes.length}`,
      `  URL节点: ${urlNodes.length}`,
      `  LaTeX节点: ${latexNodes.length}`,
      `  总节点数: ${totalNodes}`,
      ``,
      `连线类：`,
      `  直线连线: ${lineEdges.length}`,
      `  曲线连线: ${crEdges.length}`,
      `  总连线数: ${edges.length}`,
      ``,
      `其他：`,
      `  分组/Section: ${sections.length}`,
      `  关联/Association: ${associations.length}`,
      `  连接点: ${connectPoints.length}`,
      `  笔触: ${penStrokes.length}`,
      ``,
      `文字统计：`,
      `  节点文字总字符数: ${nodeChars}`,
      `  连线文字总字符数: ${edgeChars}`,
      `  总字符数: ${nodeChars + edgeChars}`,
    ].join("\n");

    await prg.dialog_copy("复杂度分析结果", "", stats);
  }),
);

export {};