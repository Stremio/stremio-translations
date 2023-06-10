plugins {
    kotlin("multiplatform")
    id("com.android.library")
    id("com.google.devtools.ksp")
}

repositories {
    google()
    mavenCentral()
}

val lyricistVersion = "1.4.1"

kotlin {
    android()

    sourceSets {
        val commonMain by getting {
            dependencies {
                implementation("cafe.adriel.lyricist:lyricist:${lyricistVersion}")
            }
        }
    }
}

android {
    compileSdk = 31

    defaultConfig {
        minSdkVersion(21)
        targetSdkVersion(31)
        // versionCode = 7
        // versionName = "1.43.17"
    }
}

dependencies {
    add("kspCommonMainMetadata", "cafe.adriel.lyricist:lyricist-processor:${lyricistVersion}")
}

// workaround for KSP only in Common Main.
// https://github.com/google/ksp/issues/567
tasks.withType<org.jetbrains.kotlin.gradle.dsl.KotlinCompile<*>>().all {
    if(name != "kspCommonMainKotlinMetadata") {
        dependsOn("kspCommonMainKotlinMetadata")
    }
}
