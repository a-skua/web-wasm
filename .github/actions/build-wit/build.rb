# frozen_string_literal: true

# Build a WIT package under spec/<package> with wkg.
#
# Usage: ruby build.rb <package>
#
# Writes `version` and `path` to $GITHUB_OUTPUT when it is set.

require "tmpdir"

package = ARGV.fetch(0) { abort "usage: ruby build.rb <package>" }
dir = File.join("spec", package)
package_wit = File.join(dir, "wit", "package.wit")

version = File.read(package_wit)[/^package web:[a-z-]+@([0-9A-Za-z.+-]+);$/, 1]
abort "::error::failed to read version from #{package_wit}" if version.nil?

out = File.join(ENV.fetch("RUNNER_TEMP") { Dir.tmpdir }, "web_#{package}_wit.wasm")

system("wkg", "wit", "build", "-o", out, chdir: dir, exception: true)

if (github_output = ENV["GITHUB_OUTPUT"])
  File.open(github_output, "a") do |f|
    f.puts "version=#{version}"
    f.puts "path=#{out}"
  end
end

puts "built web:#{package}@#{version} -> #{out}"
