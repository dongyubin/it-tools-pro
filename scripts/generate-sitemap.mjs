#!/usr/bin/env node
import { Readable } from 'stream';
import { SitemapStream, streamToPromise } from 'sitemap';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

// 获取基础URL
const baseUrl = process.env.VITE_VERCEL_URL ? `https://${process.env.VITE_VERCEL_URL}` : 'https://it-tools.dev';

async function generateSitemap() {
  try {
    console.log('Generating sitemap...');
    
    // 由于动态导入可能会有问题，我们使用静态的路由列表
    // 在实际项目中，你可能需要根据实际情况调整这个列表
    const basicRoutes = [
      { url: '/', changefreq: 'daily', priority: 1.0 },
      { url: '/about', changefreq: 'monthly', priority: 0.7 },
    ];
    
    // 工具路由列表 - 这些是从项目中提取的主要工具路由
    // 注意：这是一个简化版本，实际项目中应该从工具配置中动态获取
    const toolRoutes = [
      { url: '/tools/ascii-text-drawer', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/base64-file-converter', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/base64-string-converter', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/basic-auth-generator', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/bcrypt', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/bip39-generator', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/camera-recorder', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/case-converter', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/chmod-calculator', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/chronometer', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/color-converter', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/crontab-generator', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/date-time-converter', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/device-information', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/email-normalizer', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/emoji-picker', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/encryption', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/eta-calculator', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/git-memo', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/hash-text', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/hmac-generator', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/html-entities', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/http-status-codes', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/integer-base-converter', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/ipv4-address-converter', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/ipv4-range-expander', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/ipv4-subnet-calculator', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/ipv6-ula-generator', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/json-diff', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/json-minify', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/json-to-csv', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/json-to-toml', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/json-to-xml', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/json-viewer', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/jwt-parser', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/keycode-info', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/list-converter', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/mac-address-generator', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/mac-address-lookup', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/markdown-to-html', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/math-evaluator', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/mime-types', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/numeronym-generator', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/otp-code-generator-and-validator', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/pdf-signature-checker', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/percentage-calculator', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/qr-code-generator', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/regex-memo', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/regex-tester', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/rsa-key-pair-generator', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/random-port-generator', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/roman-numeral-converter', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/safelink-decoder', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/slugify-string', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/sql-prettify', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/string-obfuscator', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/svg-placeholder-generator', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/text-diff', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/text-statistics', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/text-to-binary', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/text-to-nato-alphabet', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/text-to-unicode', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/temperature-converter', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/token-generator', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/toml-to-json', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/toml-to-yaml', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/ulid-generator', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/url-encoder', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/url-parser', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/user-agent-parser', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/uuid-generator', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/wifi-qr-code-generator', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/xml-formatter', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/xml-to-json', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/yaml-to-json-converter', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/yaml-to-toml', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/yaml-viewer', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/json-to-yaml-converter', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools/password-strength-analyser', changefreq: 'weekly', priority: 0.8 },
    ];
    
    // 合并所有路由
    const routes = [...basicRoutes, ...toolRoutes];
    
    // 创建sitemap流
    const sitemapStream = new SitemapStream({
      hostname: baseUrl,
      lastmodDateOnly: true,
    });
    
    // 写入路由到sitemap
    Readable.from(routes)
      .pipe(sitemapStream)
      .on('error', (error) => {
        console.error('Error generating sitemap:', error);
        process.exit(1);
      });
    
    // 生成sitemap
    const sitemap = await streamToPromise(sitemapStream);
    
    // 确保dist目录存在
    const distDir = path.join(projectRoot, 'dist');
    try {
      await fs.access(distDir);
    } catch {
      await fs.mkdir(distDir, { recursive: true });
    }
    
    // 保存sitemap.xml到dist目录
    const sitemapPath = path.join(distDir, 'sitemap.xml');
    await fs.writeFile(sitemapPath, sitemap.toString(), 'utf-8');
    
    console.log(`Sitemap generated successfully at ${sitemapPath}`);
    console.log(`Base URL used: ${baseUrl}`);
    console.log(`Total URLs in sitemap: ${routes.length}`);
  } catch (error) {
    console.error('Failed to generate sitemap:', error);
    process.exit(1);
  }
}

generateSitemap();
