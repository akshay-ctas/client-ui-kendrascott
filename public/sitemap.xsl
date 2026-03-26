<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">

  <xsl:template match="/">
    <html>
      <head>
        <title>Sitemap | Kendrascott </title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background: #f9fafb;
            color: #111827;
            padding: 30px;
          }
          h1 {
            margin-bottom: 10px;
          }
          p {
            color: #6b7280;
            margin-bottom: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 10px;
            overflow: hidden;
          }
          th, td {
            border: 1px solid #e5e7eb;
            padding: 12px;
            text-align: left;
            font-size: 14px;
          }
          th {
            background: #f3f4f6;
          }
          a {
            color: #2563eb;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          .badge {
            padding: 4px 8px;
            border-radius: 6px;
            background: #e5e7eb;
            font-size: 12px;
          }
        </style>
      </head>
      <body>

        <h1>📄 Kendrascott sitemap</h1>
        <p>Total URLs: 
          <strong>
            <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/>
          </strong>
        </p>

        <table>
          <tr>
            <th>#</th>
            <th>URL</th>
            <th>Last Modified</th>
            <th>Change Freq</th>
            <th>Priority</th>
          </tr>

          <xsl:for-each select="sitemap:urlset/sitemap:url">
            <tr>
              <td>
                <xsl:value-of select="position()"/>
              </td>

              <td>
                <a href="{sitemap:loc}" target="_blank">
                  <xsl:value-of select="sitemap:loc"/>
                </a>
              </td>

              <td>
                <xsl:choose>
                  <xsl:when test="sitemap:lastmod">
                    <xsl:value-of select="sitemap:lastmod"/>
                  </xsl:when>
                  <xsl:otherwise>-</xsl:otherwise>
                </xsl:choose>
              </td>

              <td>
                <xsl:choose>
                  <xsl:when test="sitemap:changefreq">
                    <span class="badge">
                      <xsl:value-of select="sitemap:changefreq"/>
                    </span>
                  </xsl:when>
                  <xsl:otherwise>-</xsl:otherwise>
                </xsl:choose>
              </td>

              <td>
                <xsl:value-of select="sitemap:priority"/>
              </td>

            </tr>
          </xsl:for-each>

        </table>

      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>