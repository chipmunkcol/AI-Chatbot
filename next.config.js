/** @type {import('next').NextConfig} */
const nextConfig = {
  // 이미지 최적화 (향후 이미지 업로드 기능 추가 시)
  images: {
    domains: [],
  },
  // 압축 설정
  compress: true,
  // 파워드 바이 헤더 제거 (보안)
  poweredByHeader: false,
  // Webpack 설정
  webpack: (config, { isServer }) => {
    if (isServer) {
      // 서버 사이드에서만 필요한 패키지들을 external로 설정
      config.externals.push("pdf-parse", "mammoth");
    }

    // 특정 패턴의 파일들을 빌드에서 제외
    config.module.rules.push({
      test: /\/test\//,
      use: "ignore-loader",
    });

    return config;
  },
  // API Route body size 제한
  experimental: {
    serverComponentsExternalPackages: ["pdf-parse", "mammoth"],
  },
};

module.exports = nextConfig;
