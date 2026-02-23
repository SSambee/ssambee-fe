module.exports = {
  ci: {
    collect: {
      startServerCommand: "pnpm start", // 빌드 후 서버를 띄우는 명령어
      url: ["http://localhost:3000"], // 검사할 URL
      numberOfRuns: 3, // 측정 신뢰도를 위해 3번 실행
    },
    upload: {
      target: "filesystem", // 로컬 파일로 저장
      outputDir: "./lhci_reports",
    },
    assert: {
      assertions: {
        "legacy-javascript-insight": "off",
        "network-dependency-tree-insight": "off",
        "categories:performance": ["warn", { minScore: 0.3 }], // 성능 80점 미만 시 경고
        "categories:accessibility": ["warn", { minScore: 0.5 }],
        "categories:bast-practices": ["warn", { minScore: 0.5 }],
        "categories:seo": ["warn", { minScore: 0.3 }],

        // interactive: "off", // 시간 관련 지표들
        "largest-contentful-paint": "off",
        "first-contentful-paint": "off",
        "render-blocking-resources": "off",

        "errors-in-console": "off",
        "unused-javascript": "off",
        "valid-source-maps": "off",
      },
    },
  },
};
